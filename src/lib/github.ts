import { githubUser } from "@/consts"

export type ActivityKind =
    | "push"
    | "pull-request"
    | "merge"
    | "issue"
    | "comment"
    | "branch"
    | "star"
    | "fork"
    | "release"

export interface Activity {
    id: string
    kind: ActivityKind
    text: string
    repo: string
    date: string
    commits?: number
}

interface GitHubEvent {
    id: string
    type: string
    created_at: string
    repo: { name: string }
    payload: {
        action?: string
        ref?: string | null
        ref_type?: string
        before?: string
        head?: string
        number?: number
        pull_request?: { url: string; number: number; merged?: boolean }
        issue?: { number: number; title: string }
        release?: { tag_name: string; name: string | null }
    }
}

interface PushRange {
    before: string
    head: string
}

type PendingActivity = Activity & { pullUrl?: string; pushes?: PushRange[] }

function githubHeaders() {
    const token = process.env.GITHUB_TOKEN
    return {
        Accept: "application/vnd.github+json",
        "User-Agent": "thororen-website",
        ...(token && { Authorization: `Bearer ${token}` }),
    }
}

const firstLine = (text: string) => text.split("\n")[0]

function describe(
    event: GitHubEvent,
): Omit<PendingActivity, "id" | "repo" | "date"> | null {
    const { type, payload } = event

    switch (type) {
        case "PushEvent": {
            const { before, head } = payload
            return {
                kind: "push",
                text: pushText(1),
                commits: 1,
                pushes: before && head ? [{ before, head }] : [],
            }
        }
        case "PullRequestEvent": {
            const pr = payload.pull_request
            if (!pr) return null
            const merged =
                payload.action === "merged" ||
                (payload.action === "closed" && pr.merged)
            const verb = merged ? "Merged" : capitalize(payload.action)
            return {
                kind: merged ? "merge" : "pull-request",
                text: `${verb} PR #${pr.number}`,
                pullUrl: pr.url,
            }
        }
        case "PullRequestReviewEvent": {
            const pr = payload.pull_request
            if (!pr) return null
            return {
                kind: "pull-request",
                text: `Reviewed PR #${pr.number}`,
                pullUrl: pr.url,
            }
        }
        case "IssuesEvent": {
            const issue = payload.issue
            if (!issue) return null
            return {
                kind: "issue",
                text: `${capitalize(payload.action)} issue #${issue.number}: ${issue.title}`,
            }
        }
        case "IssueCommentEvent": {
            const issue = payload.issue
            if (!issue) return null
            return {
                kind: "comment",
                text: `Commented on #${issue.number}: ${issue.title}`,
            }
        }
        case "CreateEvent": {
            if (payload.ref_type === "repository") {
                return { kind: "branch", text: "Created the repository" }
            }
            return {
                kind: "branch",
                text: `Created ${payload.ref_type} ${payload.ref}`,
            }
        }
        case "WatchEvent":
            return { kind: "star", text: "Starred" }
        case "ForkEvent":
            return { kind: "fork", text: "Forked" }
        case "ReleaseEvent": {
            const release = payload.release
            if (!release) return null
            return {
                kind: "release",
                text: `Published ${release.name || release.tag_name}`,
            }
        }
        default:
            return null
    }
}

const pushText = (count: number) =>
    `Pushed ${count} commit${count === 1 ? "" : "s"}`

function mergePushes(activity: PendingActivity[]) {
    const merged: PendingActivity[] = []

    for (const item of activity) {
        const prev = merged.at(-1)
        const sameDay =
            prev && prev.date.slice(0, 10) === item.date.slice(0, 10)

        if (
            prev?.kind === "push" &&
            item.kind === "push" &&
            prev.repo === item.repo &&
            sameDay
        ) {
            prev.commits = (prev.commits ?? 1) + (item.commits ?? 1)
            prev.text = pushText(prev.commits)
            prev.pushes = [...(prev.pushes ?? []), ...(item.pushes ?? [])]
        } else {
            merged.push({ ...item })
        }
    }

    return merged
}

function capitalize(text = "") {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

async function fetchGitHub<T>(url: string, revalidate: number | false) {
    try {
        const res = await fetch(url, {
            headers: githubHeaders(),
            next: { revalidate },
            signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) return null
        return (await res.json()) as T
    } catch {
        return null
    }
}

interface CommitInfo {
    commit: { message: string }
}

async function getPushCommits(repo: string, { before, head }: PushRange) {
    const base = `https://api.github.com/repos/${repo}`

    // New branches have no previous commit to compare against
    if (/^0+$/.test(before)) {
        const data = await fetchGitHub<CommitInfo>(
            `${base}/commits/${head}`,
            false,
        )
        return data && { count: 1, message: data.commit.message }
    }

    const data = await fetchGitHub<{
        total_commits: number
        commits: CommitInfo[]
    }>(`${base}/compare/${before}...${head}`, false)
    return (
        data && {
            count: data.total_commits,
            message: data.commits.at(-1)?.commit.message,
        }
    )
}

async function resolve({
    pullUrl,
    pushes,
    ...item
}: PendingActivity): Promise<Activity> {
    if (pullUrl) {
        const pull = await fetchGitHub<{ title: string }>(pullUrl, 86400)
        return pull ? { ...item, text: `${item.text}: ${pull.title}` } : item
    }

    if (pushes?.length) {
        const results = await Promise.all(
            pushes.map((push) => getPushCommits(item.repo, push)),
        )
        const commits = results.reduce((sum, r) => sum + (r?.count || 1), 0)
        const message = results.length === 1 && results[0]?.message
        return {
            ...item,
            commits,
            text: message ? firstLine(message) : pushText(commits),
        }
    }

    return item
}

export async function getRecentActivity(
    limit = 10,
): Promise<Activity[] | null> {
    try {
        const res = await fetch(
            `https://api.github.com/users/${githubUser}/events/public?per_page=100`,
            {
                headers: githubHeaders(),
                next: { revalidate: 300 },
                signal: AbortSignal.timeout(5000),
            },
        )
        if (!res.ok) throw new Error(`GitHub responded ${res.status}`)

        const events = (await res.json()) as GitHubEvent[]
        const activity: PendingActivity[] = []

        events.sort((x, y) => y.created_at.localeCompare(x.created_at))

        for (const event of events) {
            const described = describe(event)
            if (!described) continue
            activity.push({
                ...described,
                id: event.id,
                repo: event.repo.name,
                date: event.created_at,
            })
        }

        const recent = mergePushes(activity).slice(0, limit)

        return Promise.all(recent.map(resolve))
    } catch (e) {
        console.error("Error fetching GitHub activity:", e)
        return null
    }
}
