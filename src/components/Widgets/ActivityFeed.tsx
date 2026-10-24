import {
    GitBranch,
    GitCommitHorizontal,
    GitFork,
    GitMerge,
    GitPullRequest,
    MessageSquare,
    Rocket,
    Star,
    CircleDot,
} from "lucide-react"
import Box from "@/components/Base/Box"
import { githubUser } from "@/consts"
import { getRecentActivity, type ActivityKind } from "@/lib/github"
import type { Icon } from "@/types"

const icons: Record<ActivityKind, Icon> = {
    push: GitCommitHorizontal,
    "pull-request": GitPullRequest,
    merge: GitMerge,
    issue: CircleDot,
    comment: MessageSquare,
    branch: GitBranch,
    star: Star,
    fork: GitFork,
    release: Rocket,
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
})

export default async function ActivityFeed() {
    const activity = await getRecentActivity(30)

    if (!activity?.length) {
        return (
            <Box compact className="text-neutral-500 dark:text-neutral-400">
                {activity
                    ? "No recent public activity."
                    : "Couldn't load activity right now."}
            </Box>
        )
    }

    return (
        <Box compact className="flex flex-1 flex-col">
            <div className="relative lg:min-h-110 lg:flex-1">
                <ul className="flex flex-col lg:absolute lg:inset-0 lg:flex-wrap lg:content-start lg:overflow-hidden">
                    {activity.map(({ id, kind, text, repo, date }) => {
                        const Icon = icons[kind]

                        return (
                            <li
                                key={id}
                                className="flex w-full items-center gap-3 border-t border-zinc-300 py-2.5 first:border-t-0 first:pt-0 max-lg:nth-[n+11]:hidden lg:grow dark:border-zinc-800"
                            >
                                <Icon
                                    size={16}
                                    className="shrink-0 text-neutral-500 dark:text-neutral-400"
                                />

                                <div className="flex min-w-0 flex-1 flex-col sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] sm:items-baseline sm:gap-4">
                                    <span
                                        className="truncate text-neutral-800 dark:text-neutral-200"
                                        title={text}
                                    >
                                        {text}
                                    </span>
                                    <a
                                        href={`https://github.com/${repo}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        title={repo}
                                        className="truncate text-sm text-neutral-500 hover:text-rose-500 dark:text-neutral-400"
                                    >
                                        {repo}
                                    </a>
                                </div>

                                <time
                                    dateTime={date}
                                    className="shrink-0 text-sm text-neutral-500 tabular-nums dark:text-neutral-400"
                                >
                                    {dateFormat.format(new Date(date))}
                                </time>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <a
                href={`https://github.com/${githubUser}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-fit text-sm font-medium text-neutral-600 hover:text-rose-500 dark:text-neutral-400"
            >
                More on GitHub →
            </a>
        </Box>
    )
}
