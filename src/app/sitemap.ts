import type { MetadataRoute } from "next"
import { projects, siteUrl } from "@/consts"

const pages = [
    "",
    "/projects",
    "/now",
    "/discord",
    "/discord/modules",
    "/discord/color",
    "/discord/bot-invite",
    "/discord/snowflake",
    "/discord/timestamp",
    "/discord/markdown",
    "/misc",
    "/misc/dev-tools",
    "/misc/minecraft-formatting",
]

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
        ...projects.map(({ slug }) => ({
            url: `${siteUrl}/projects/${slug}`,
        })),
    ]
}
