import type { Info, MiscPage, NavLink, Social, Project } from "./types"
import {
    Bot,
    Clock,
    Hash,
    House,
    MapPin,
    MessageSquareCode,
    Notebook,
    PackageSearch,
    Palette,
    Pickaxe,
    Radio,
    Shapes,
    User,
    Wrench,
} from "lucide-react"
import Github from "./components/Icons/Github"
import LastFM from "./components/Icons/LastFM"
import Discord from "./components/Icons/Discord"
import Steam from "./components/Icons/Steam"

export const displayName = "Lukka"
export const fullName = "Luka Pajkanovic"

export const siteUrl = "https://lukka.dev"
export const discordUserId = "998585779804708864"
export const pfpFallback = "/assets/avatar/fallback.png"
export const githubUser = "Lukk1a"
export const steamId = "o_Lukka"
export const mcUsername = "Lukk1a"
export const mcUuid = "f7706a5939b14b9db4f9b11e03c7f5ea"
export const lastfmUser = "Lukka1232"
export const lastfmApiKey = "ac7abdcfbbad42c788e072bbe43f1be6"

export const liveRefreshSeconds = 15

export const bio =
    "Hi! I'm Lukka! I'm a systems and web developer focused on low-latency native systems and modern web platforms."

export const navLinks: NavLink[] = [
    { text: "Home", href: "/", icon: House },
    { text: "Projects", href: "/projects", icon: Notebook },
    { text: "Now", href: "/now", icon: Radio },
    { text: "Discord", href: "/discord", icon: Discord },
    { text: "Misc", href: "/misc", icon: Shapes },
]

export const discordPages: MiscPage[] = [
    {
        title: "Discord Module Explorer",
        description:
            "Browse, search and cross-reference the webpack modules of recent Discord builds.",
        href: "/discord/modules",
        icon: PackageSearch,
    },
    {
        title: "Embed Color Converter",
        description:
            "Convert between hex, decimal, RGB and HSL values for Discord embed colors.",
        href: "/discord/color",
        icon: Palette,
    },
    {
        title: "Bot Invite Generator",
        description:
            "Build a Discord bot invite link and inspect its permission number.",
        href: "/discord/bot-invite",
        icon: Bot,
    },
    {
        title: "Snowflake Decoder",
        description:
            "Paste a Discord ID, mention or message link to see when it was created.",
        href: "/discord/snowflake",
        icon: Hash,
    },
    {
        title: "Timestamp Generator",
        description:
            "Make Discord timestamp codes that show the right time for everyone.",
        href: "/discord/timestamp",
        icon: Clock,
    },
    {
        title: "Discord Markdown Preview",
        description:
            "Preview Discord markdown, spoilers, quotes and code blocks before you send them.",
        href: "/discord/markdown",
        icon: MessageSquareCode,
    },
]

export const miscPages: MiscPage[] = [
    {
        title: "Developer Tools",
        description:
            "Encode Base64, format JSON and generate hashes without sending your text anywhere.",
        href: "/misc/dev-tools",
        icon: Wrench,
    },
    {
        title: "Minecraft Formatting",
        description:
            "Preview Minecraft color and style codes written with & or §.",
        href: "/misc/minecraft-formatting",
        icon: Pickaxe,
    },
]

export const information: Info[] = [
    {
        icon: MapPin,
        text: "Serbia",
    },
    {
        icon: User,
        text: "He/Him",
    },
]

export const socials: Social[] = [
    {
        text: "GitHub",
        url: `https://github.com/${githubUser}`,
        icon: Github,
    },
    ...(steamId
        ? [
              {
                  text: "Steam",
                  url: /^\d{17}$/.test(steamId)
                      ? `https://steamcommunity.com/profiles/${steamId}`
                      : `https://steamcommunity.com/id/${steamId}/`,
                  icon: Steam,
              },
          ]
        : []),
    {
        text: "Discord",
        url: `https://discord.com/users/${discordUserId}`,
        icon: Discord,
    },
    {
        text: "Last.fm",
        url: `https://www.last.fm/user/${lastfmUser}`,
        icon: LastFM,
    },
]

export const projects: Project[] = [
    {
        slug: "oculusmc",
        start: 2026,
        title: "OculusMC",
        description:
            "Precision Minecraft server dashboard — PaperMC plugin with Javalin API, React+Vite frontend, live Anvil map, and Plan analytics.",
        url: "https://github.com/Lukk1a/OculusMC",
        github: "https://github.com/Lukk1a/OculusMC",
        tags: ["Java", "PaperMC", "React", "Vite", "TypeScript"],
        tasks: [
            "Full-stack dashboard development",
            "PaperMC plugin & Javalin API engineering",
            "Interactive live Anvil map renderer",
        ],
    },
    {
        slug: "activescreen-desktop",
        start: 2026,
        title: "activeScreen.desktop",
        description:
            "Desktop activity and monitor utility with high-efficiency screen capture and local telemetry.",
        url: "https://github.com/Lukk1a/activeScreen.desktop",
        github: "https://github.com/Lukk1a/activeScreen.desktop",
        tags: ["TypeScript", "Desktop", "Node.js"],
        tasks: [
            "Desktop architecture and integration",
            "Low-overhead telemetry capture",
        ],
    },
    {
        slug: "portfolio-website",
        start: 2026,
        title: "portfolio-website",
        description:
            "Personal engineering portfolio engineered for high runtime performance, WCAG 2.2 AA accessibility, and automated multi-stage CI/CD container delivery.",
        url: "https://github.com/Lukk1a/portfolio-website",
        github: "https://github.com/Lukk1a/portfolio-website",
        tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Docker"],
        tasks: [
            "Design system and UI performance",
            "Accessibility auditing",
            "CI/CD containerization pipeline",
        ],
    },
    {
        slug: "sys-mcp",
        start: 2026,
        title: "sys-mcp",
        description:
            "High-performance Model Context Protocol (MCP) server for systems diagnostics, metrics, and contextual environment feeds.",
        url: "https://github.com/Lukk1a/sys-mcp",
        github: "https://github.com/Lukk1a/sys-mcp",
        tags: ["TypeScript", "MCP", "Systems", "Node.js"],
        tasks: [
            "MCP tool interface implementation",
            "System metrics integration",
        ],
    },
]

interface FriendItem {
    url: string
    fallback: string
    alt: string
    name: string
    id: string
}

const friendsList: FriendItem[] = []

export const friends = friendsList.map(({ fallback, ...f }) => ({
    ...f,
    img: `/assets/profile?userId=${f.id}`,
}))

export const avatarFallbacks = new Map<string, string>([
    [discordUserId, pfpFallback],
    ...friendsList.map((f) => [f.id, f.fallback] as [string, string]),
])
