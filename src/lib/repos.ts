import { createCache } from "@/lib/daily-cache"
import type { Repo } from "@/types"

interface GitHubRepo {
    name: string
    html_url: string
    description: string | null
    language: string | null
    stargazers_count: number
    fork: boolean
    archived: boolean
    pushed_at: string
}

export function ownerOf(githubUrl?: string) {
    if (!githubUrl) return null
    try {
        const parts = new URL(githubUrl).pathname.split("/").filter(Boolean)
        return parts.length === 1 ? parts[0] : null
    } catch {
        return null
    }
}

function fetchRepos(kind: "orgs" | "users", owner: string) {
    return fetch(
        `https://api.github.com/${kind}/${encodeURIComponent(owner)}/repos?per_page=100&sort=pushed`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "lukka-website",
            },
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        },
    )
}

async function loadRepos(owner: string): Promise<Repo[]> {
    let res = await fetchRepos("orgs", owner)
    if (res.status === 404) res = await fetchRepos("users", owner)
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`)

    const repos = (await res.json()) as GitHubRepo[]

    return repos
        .filter((repo) => repo.name !== ".github")
        .sort(
            (a, b) =>
                b.stargazers_count - a.stargazers_count ||
                b.pushed_at.localeCompare(a.pushed_at),
        )
        .map((repo) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            fork: repo.fork,
            archived: repo.archived,
        }))
}

export const getRepos = createCache(loadRepos)
