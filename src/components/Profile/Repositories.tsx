"use client"

import { useEffect, useState } from "react"
import { ArrowRight, FolderGit2 } from "lucide-react"
import Section from "@/components/Base/Section"
import RepoCard from "@/components/Cards/RepoCard"
import type { Repo } from "@/types"

const MAX_REPOS = 9

export default function Repositories({
    slug,
    github,
}: {
    slug: string
    github: string
}) {
    const [repos, setRepos] = useState<Repo[] | null | undefined>()

    useEffect(() => {
        let cancelled = false

        fetch(`/api/repos/${slug}`)
            .then((res) => (res.ok ? (res.json() as Promise<Repo[]>) : null))
            .catch(() => null)
            .then((result) => {
                if (!cancelled) setRepos(result)
            })

        return () => {
            cancelled = true
        }
    }, [slug])

    if (repos === null || (repos && repos.length < 2)) return null

    return (
        <Section
            icon={FolderGit2}
            title="Repositories"
            action={
                repos &&
                repos.length > MAX_REPOS && (
                    <a
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-rose-500"
                    >
                        All {repos.length} on GitHub
                        <ArrowRight size={14} />
                    </a>
                )
            }
        >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-3">
                {repos
                    ? repos
                          .slice(0, MAX_REPOS)
                          .map((repo) => <RepoCard key={repo.url} {...repo} />)
                    : Array.from({ length: 3 }, (_, i) => (
                          <div
                              key={i}
                              className="h-32 animate-pulse rounded-2xl border border-zinc-300 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                          />
                      ))}
            </div>
        </Section>
    )
}
