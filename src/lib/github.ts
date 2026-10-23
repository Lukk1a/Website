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
        size?: number
        commits?: { message: string }[]
        number?: number
        pull_request?: { url: string; number: number; merged?: boolean }
        issue?: { number: number; title: string }
        release?: { tag_name: string; name: string | null }
    }
}

type PendingActivity = Activity & { pullUrl?: string }

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
            const size = payload.size ?? payload.commits?.length ?? 1
            const latest = payload.commits?.at(-1)?.message
            return {
                kind: "push",
                text: latest ? firstLine(latest) : pushText(size),
                commits: size,
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

function mergePushes<T extends Activity>(activity: T[]) {
    const merged: T[] = []

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
        } else {
            merged.push({ ...item })
        }
    }

    return merged
}

function capitalize(text = "") {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

async function getPullTitle(url: string) {
    try {
        const res = await fetch(url, {
            headers: githubHeaders(),
            next: { revalidate: 86400 },
            signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) return null
        const { title } = (await res.json()) as { title: string }
        return title
    } catch {
        return null
    }
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

        return Promise.all(
            recent.map(async ({ pullUrl, ...item }) => {
                const title = pullUrl && (await getPullTitle(pullUrl))
                return title
                    ? { ...item, text: `${item.text}: ${title}` }
                    : item
            }),
        )
    } catch (e) {
        console.error("Error fetching GitHub activity:", e)
        return null
    }
}
