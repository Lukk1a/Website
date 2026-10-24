import Link from "next/link"
import { ArrowRight, Calendar, ExternalLink } from "lucide-react"
import Github from "@/components/Icons/Github"
import Tag from "@/components/Base/Tag"
import ProjectIcon from "@/components/Base/ProjectIcon"
import { isActive, yearRange } from "@/lib/projects"
import type { Project } from "@/types"

export default function ProjectCard(project: Project) {
    const { slug, title, description, url, github, icon } = project
    const active = isActive(project)

    return (
        <div className="group relative flex flex-col gap-3 rounded-2xl border border-zinc-300 bg-zinc-100 px-6 py-5 text-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:border-zinc-700 dark:hover:shadow-rose-950/10">
            <Link
                href={`/projects/${slug}`}
                aria-label={`${title} details`}
                className="absolute inset-0 z-0 rounded-2xl"
            />

            <h3 className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                {icon && <ProjectIcon src={icon} size={28} />}
                {title}

                <span className="relative z-10 ml-auto flex items-center gap-3 text-neutral-500">
                    {url && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Visit ${title}`}
                            className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                            <ExternalLink size={16} />
                        </a>
                    )}
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="View source on GitHub"
                            className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                            <Github size={16} />
                        </a>
                    )}
                </span>
            </h3>

            <p className="line-clamp-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {description}
            </p>

            <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                <Tag className={active ? "bg-emerald-500/20" : ""}>
                    {active ? "Active" : "Past"}
                </Tag>
                <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {yearRange(project)}
                </span>

                <span className="ml-auto flex items-center gap-1 font-medium transition-colors group-hover:text-rose-500">
                    Details <ArrowRight size={14} />
                </span>
            </div>
        </div>
    )
}
