import Link from "next/link"
import { notFound } from "next/navigation"
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Info,
    ListChecks,
} from "lucide-react"
import { displayName, projects } from "@/consts"
import { createMetadata } from "@/lib/metadata"
import { getProject, isActive, yearRange } from "@/lib/projects"
import { ownerOf } from "@/lib/repos"
import Box from "@/components/Base/Box"
import ProjectIcon from "@/components/Base/ProjectIcon"
import Section from "@/components/Base/Section"
import Tag from "@/components/Base/Tag"
import Github from "@/components/Icons/Github"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import Repositories from "@/components/Profile/Repositories"

interface Props {
    params: Promise<{ slug: string }>
}

export function generateStaticParams() {
    return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
    const project = getProject((await params).slug)
    if (!project) return {}

    return createMetadata({
        title: `${project.title} | ${displayName}`,
        description: project.description,
        path: `/projects/${project.slug}`,
        image: `/projects/${project.slug}/og.png`,
    })
}

const linkClass =
    "inline-flex items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700"

export default async function ProjectPage({ params }: Props) {
    const project = getProject((await params).slug)
    if (!project) notFound()

    const { title, description, details, tasks, url, github, icon } = project

    const index = projects.findIndex(({ slug }) => slug === project.slug)
    const previous = projects[index - 1]
    const next = projects[index + 1]

    return (
        <>
            <DiscordEmbed page="project" query={{ slug: project.slug }} />

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                <Link
                    href="/projects"
                    className="flex items-center gap-1 hover:text-rose-500"
                >
                    <ArrowLeft size={16} /> All projects
                </Link>

                <nav aria-label="More projects" className="flex gap-5">
                    {previous && (
                        <Link
                            href={`/projects/${previous.slug}`}
                            aria-label={`Previous project: ${previous.title}`}
                            className="flex min-w-0 items-center gap-1 hover:text-rose-500"
                        >
                            <ChevronLeft size={16} className="shrink-0" />
                            <span className="truncate">{previous.title}</span>
                        </Link>
                    )}
                    {next && (
                        <Link
                            href={`/projects/${next.slug}`}
                            aria-label={`Next project: ${next.title}`}
                            className="flex min-w-0 items-center gap-1 hover:text-rose-500"
                        >
                            <span className="truncate">{next.title}</span>
                            <ChevronRight size={16} className="shrink-0" />
                        </Link>
                    )}
                </nav>
            </div>

            <Box className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {icon && (
                    <ProjectIcon
                        src={icon}
                        size={64}
                        rounded="rounded-xl"
                        padding="p-2"
                    />
                )}

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <Tag
                            className={
                                isActive(project) ? "bg-emerald-500/20" : ""
                            }
                        >
                            {isActive(project) ? "Active" : "Past"}
                        </Tag>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {yearRange(project)}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:ml-auto">
                    {url && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className={linkClass}
                        >
                            <ExternalLink size={16} /> Website
                        </a>
                    )}
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noreferrer"
                            className={linkClass}
                        >
                            <Github size={16} /> Source
                        </a>
                    )}
                </div>
            </Box>

            <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <Section icon={Info} title="About">
                    <Box className="flex flex-col gap-4 leading-7">
                        <p>{description}</p>
                        {details?.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </Box>
                </Section>

                <div className="flex flex-col gap-8">
                    {tasks && tasks.length > 0 && (
                        <Section
                            icon={ListChecks}
                            title={
                                isActive(project) ? "What I do" : "What I did"
                            }
                        >
                            <Box>
                                <ul className="list-disc space-y-2 pl-5 leading-7">
                                    {tasks.map((task) => (
                                        <li key={task}>{task}</li>
                                    ))}
                                </ul>
                            </Box>
                        </Section>
                    )}
                </div>
            </div>

            {github && ownerOf(github) && (
                <Repositories
                    key={project.slug}
                    slug={project.slug}
                    github={github}
                />
            )}
        </>
    )
}
