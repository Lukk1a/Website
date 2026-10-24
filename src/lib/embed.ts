import {
    bio,
    discordPages,
    displayName,
    discordUserId,
    miscPages,
    projects,
    siteUrl,
    socials,
} from "@/consts"
import { createCache } from "@/lib/daily-cache"
import { getProject, isActive, yearRange } from "@/lib/projects"
import { excerpt } from "@/lib/text"
import type { MiscPage, Project } from "@/types"

const ACCENT_COLOR = 0x970000
const SOCIALS_BLACKLIST = ["donate", "discord"]

interface Link {
    label: string
    url: string
}

interface EmbedImage {
    url: string
    description: string
}

const linkRows = (links: Link[]) =>
    Array.from({ length: Math.ceil(links.length / 5) }, (_, i) => ({
        type: 1,
        components: links.slice(i * 5, i * 5 + 5).map(({ label, url }) => ({
            type: 2,
            style: 5,
            url,
            label,
        })),
    }))

async function loadAvatarHash(userId: string) {
    const res = await fetch(`https://lanyard.equicord.org/v1/users/${userId}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error(`Lanyard responded ${res.status}`)

    const json = await res.json()
    return (json?.data?.discord_user?.avatar as string | undefined) ?? null
}

const getAvatarHash = createCache(loadAvatarHash, {
    ttl: 1000 * 60 * 5,
    retryAfter: 1000 * 30,
})

async function getAvatar(): Promise<EmbedImage> {
    const hash = await getAvatarHash(discordUserId)

    return {
        url: `${siteUrl}/assets/profile${hash ? `?v=${hash}` : ""}`,
        description: "My avatar",
    }
}

const FAVICON: EmbedImage = {
    url: `${siteUrl}/assets/favicon.png`,
    description: "Site icon",
}

const header = (content: string, icon: EmbedImage) => ({
    type: 9,
    components: [{ type: 10, content }],
    accessory: {
        type: 11,
        media: { url: icon.url },
        description: icon.description,
    },
})

export function siteEmbed(avatar: EmbedImage) {
    const currentProjects = projects.filter((p) => !p.end).slice(0, 2)

    return {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [
            header(
                `# ${displayName}\n${bio}`,
                avatar,
            ),
            { type: 14 },
            {
                type: 10,
                content: `**Currently building**\n${currentProjects
                    .map((p) => `[${p.title}](${p.url})`)
                    .join(" • ")}`,
            },
            { type: 14, spacing: 1 },
            ...linkRows(
                socials
                    .filter(
                        (s) =>
                            !SOCIALS_BLACKLIST.includes(s.text.toLowerCase()),
                    )
                    .map((s) => ({ label: s.text, url: s.url })),
            ),
        ],
    }
}

export function projectEmbed(project: Project, avatar: EmbedImage) {
    const { slug, title, description, details, icon, url, github } = project

    const about = excerpt([description, ...(details ?? [])].join(" "), 280)
    const status = `${isActive(project) ? "Active" : "Past"} · ${yearRange(project)}`

    const links: Link[] = []
    if (url) links.push({ label: "Website", url })
    if (github) links.push({ label: "Source", url: github })
    links.push({ label: "Project page", url: `${siteUrl}/projects/${slug}` })

    return {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [
            header(
                `# ${title}\n${about}\n-# ${status}`,
                icon
                    ? { url: `${siteUrl}${icon}`, description: `${title} icon` }
                    : avatar,
            ),
            { type: 14, spacing: 1 },
            ...linkRows(links),
        ],
    }
}

export function pageEmbed(
    title: string,
    description: string,
    icon: EmbedImage,
) {
    return {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [header(`# ${title}\n${description}`, icon)],
    }
}

export function miscEmbed(page: MiscPage) {
    return {
        type: 17,
        accent_color: ACCENT_COLOR,
        components: [
            header(`# ${page.title}\n${page.description}`, FAVICON),
            { type: 14, spacing: 1 },
            ...linkRows([
                { label: "Open page", url: `${siteUrl}${page.href}` },
                page.href.startsWith("/discord/")
                    ? { label: "All Discord tools", url: `${siteUrl}/discord` }
                    : { label: "All misc", url: `${siteUrl}/misc` },
            ]),
        ],
    }
}

const PAGE_INFO: Record<
    string,
    { title: string; description: string; icon?: EmbedImage }
> = {
    projects: {
        title: "Projects",
        description:
            "A collection of the software and communities I'm actively building in and have worked on.",
    },
    now: {
        title: "Now",
        description:
            "A live snapshot of what I'm playing, listening to and coding, plus recent GitHub activity.",
    },
    discord: {
        title: "Discord",
        description:
            "Tools for Discord users, bot developers and client modders.",
        icon: FAVICON,
    },
    misc: {
        title: "Misc",
        description:
            "Small standalone pages and tools that don't fit anywhere else.",
        icon: FAVICON,
    },
}

export async function getEmbed(params: URLSearchParams) {
    const page = params.get("page")
    const slug = params.get("slug")
    const avatar = await getAvatar()

    if (page === "project" && slug) {
        const project = getProject(slug)
        return project ? projectEmbed(project, avatar) : null
    }

    if (page === "tool" && slug) {
        const tool = [...discordPages, ...miscPages].find(
            ({ href }) =>
                href === `/discord/${slug}` ||
                href === `/misc/${slug}` ||
                href === `/${slug}`,
        )
        return tool ? miscEmbed(tool) : null
    }

    const info = page ? PAGE_INFO[page] : undefined
    return info
        ? pageEmbed(info.title, info.description, info.icon ?? avatar)
        : siteEmbed(avatar)
}
