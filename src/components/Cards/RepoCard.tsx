import { ExternalLink, Star } from "lucide-react"
import Tag from "@/components/Base/Tag"
import type { Repo } from "@/types"

export default function RepoCard({
    name,
    description,
    url,
    language,
    stars,
    fork,
    archived,
}: Repo) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-2 rounded-2xl border border-zinc-300 bg-zinc-100 px-5 py-4 text-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:border-zinc-700 dark:hover:shadow-rose-950/10"
        >
            <span className="flex items-center gap-2">
                <span className="truncate font-medium text-neutral-800 group-hover:text-rose-500 dark:text-neutral-200">
                    {name}
                </span>
                <ExternalLink
                    size={14}
                    className="ml-auto shrink-0 text-neutral-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </span>

            {description && (
                <p className="line-clamp-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    {description}
                </p>
            )}

            <span className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {language && <Tag>{language}</Tag>}
                {fork && <Tag>Fork</Tag>}
                {archived && <Tag>Archived</Tag>}
                {stars > 0 && (
                    <span className="ml-auto flex items-center gap-1">
                        <Star size={14} /> {stars}
                    </span>
                )}
            </span>
        </a>
    )
}
