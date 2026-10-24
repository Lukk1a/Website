"use client"

import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import Box from "@/components/Base/Box"
import CopyButton from "@/components/Tools/CopyButton"
import { fieldClass, labelClass } from "@/components/Tools/fields"

const example = [
    "# Server update",
    "Hello, **Discord**! This is *italic*, __underlined__, and ~~crossed out~~.",
    "Say hi to <@123456789012345678>, <@&234567890123456789>, and <#345678901234567890>.",
    "Event time: <t:1893456000:F> · <t:1893456000:R>",
    "",
    "> A single-line quote",
    "-# Small supporting text",
    "",
    "Inline `const answer = 42` and a ||spoiler||.",
    "",
    "```ts",
    "const greeting = 'hello Discord'",
    "console.log(greeting)",
    "```",
    "",
    "```ansi",
    "\u001b[1;32mSuccess\u001b[0m \u001b[33mWarning\u001b[0m \u001b[31mError\u001b[0m",
    "```",
].join("\n")

const ANSI_COLORS: Record<number, string> = {
    30: "#4f545c",
    31: "#ed4245",
    32: "#57f287",
    33: "#fee75c",
    34: "#5865f2",
    35: "#eb459e",
    36: "#00a8fc",
    37: "#f2f3f5",
    90: "#949ba4",
    91: "#ff6b6b",
    92: "#83e6a5",
    93: "#ffef8a",
    94: "#8ea1ff",
    95: "#f28fbd",
    96: "#6bd9ff",
    97: "#ffffff",
}

interface AnsiStyle {
    color?: string
    backgroundColor?: string
    fontWeight?: CSSProperties["fontWeight"]
    textDecoration?: CSSProperties["textDecoration"]
}

const resetAnsiStyle = (): AnsiStyle => ({})

function applyAnsiCodes(style: AnsiStyle, codes: number[]) {
    let next = { ...style }

    for (const code of codes.length ? codes : [0]) {
        if (code === 0) next = resetAnsiStyle()
        else if (code === 1) next.fontWeight = "bold"
        else if (code === 4) next.textDecoration = "underline"
        else if (code === 22) delete next.fontWeight
        else if (code === 24) delete next.textDecoration
        else if (code === 39) delete next.color
        else if (code === 49) delete next.backgroundColor
        else if (ANSI_COLORS[code]) next.color = ANSI_COLORS[code]
        else if (ANSI_COLORS[code - 10]) {
            next.backgroundColor = ANSI_COLORS[code - 10]
        }
    }

    return next
}

function AnsiText({ value }: { value: string }) {
    const normalized = value.replace(/\\(?:u001b|x1b|033)/gi, "\u001b")
    const pattern = /\u001b\[([0-9;]*)m/g
    const nodes: ReactNode[] = []
    let style = resetAnsiStyle()
    let lastIndex = 0
    let match: RegExpExecArray | null
    let index = 0

    while ((match = pattern.exec(normalized))) {
        if (match.index > lastIndex) {
            nodes.push(
                <span key={index++} style={style}>
                    {normalized.slice(lastIndex, match.index)}
                </span>,
            )
        }

        const codes = match[1]
            .split(";")
            .filter(Boolean)
            .map(Number)
            .filter(Number.isFinite)
        style = applyAnsiCodes(style, codes)
        lastIndex = pattern.lastIndex
    }

    if (lastIndex < normalized.length) {
        nodes.push(
            <span key={index} style={style}>
                {normalized.slice(lastIndex)}
            </span>,
        )
    }

    return nodes
}

const syntaxLanguages = {
    javascript: new Set(["js", "jsx", "javascript", "ts", "tsx", "typescript"]),
    json: new Set(["json"]),
    html: new Set(["html", "xml", "svg"]),
    css: new Set(["css"]),
    python: new Set(["py", "python"]),
}

const syntaxColors = {
    discord: {
        comment: "#949ba4",
        string: "#a6e3a1",
        number: "#fab387",
        keyword: "#cba6f7",
        tag: "#89b4fa",
        css: "#f38ba8",
    },
    vscode: {
        comment: "#6a9955",
        string: "#ce9178",
        number: "#b5cea8",
        keyword: "#569cd6",
        tag: "#569cd6",
        css: "#d7ba7d",
    },
}

const shikiLanguages = {
    js: "javascript",
    jsx: "jsx",
    javascript: "javascript",
    ts: "typescript",
    tsx: "tsx",
    typescript: "typescript",
    json: "json",
    html: "html",
    xml: "xml",
    svg: "html",
    css: "css",
    py: "python",
    python: "python",
    md: "markdown",
    markdown: "markdown",
} as const

function getShikiLanguage(language: string) {
    return shikiLanguages[language as keyof typeof shikiLanguages]
}

const languageBadges: Record<string, { label: string; color: string }> = {
    javascript: { label: "JS", color: "#f7df1e" },
    jsx: { label: "JSX", color: "#61dafb" },
    typescript: { label: "TS", color: "#3178c6" },
    tsx: { label: "TSX", color: "#3178c6" },
    json: { label: "{}", color: "#cbcb41" },
    html: { label: "HTML", color: "#e34f26" },
    xml: { label: "XML", color: "#8bc34a" },
    svg: { label: "SVG", color: "#ffb13b" },
    css: { label: "CSS", color: "#1572b6" },
    python: { label: "PY", color: "#3776ab" },
    markdown: { label: "MD", color: "#519aba" },
    ansi: { label: "ANSI", color: "#57f287" },
}

type ShikiToken = {
    content: string
    color?: string
}

function LanguageBadge({
    language,
    shiki,
}: {
    language: string
    shiki: boolean
}) {
    const normalizedLanguage = language.trim().toLowerCase()
    const resolvedLanguage =
        getShikiLanguage(normalizedLanguage) ?? normalizedLanguage
    const badge = languageBadges[resolvedLanguage]

    return (
        <div className="flex items-center gap-2">
            {badge && (
                <span
                    aria-hidden="true"
                    className="inline-flex min-w-6 justify-center rounded px-1 py-0.5 text-[9px] leading-none font-bold"
                    style={{
                        color: badge.color,
                        backgroundColor: `${badge.color}24`,
                    }}
                >
                    {badge.label}
                </span>
            )}
            {!badge && <span>{language}</span>}
            {shiki && (
                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-neutral-500">
                    Shiki · Dark+
                </span>
            )}
        </div>
    )
}

function ShikiCode({ code, language }: { code: string; language: string }) {
    const normalizedLanguage = language.trim().toLowerCase()
    const shikiLanguage = getShikiLanguage(normalizedLanguage)
    const codeForTokens = code.replace(/\r?\n$/, "")
    const [tokens, setTokens] = useState<ShikiToken[][] | null>(null)

    useEffect(() => {
        let cancelled = false
        setTokens(null)

        if (!shikiLanguage) return

        void import("shiki/bundle/web")
            .then(({ codeToTokens }) =>
                codeToTokens(codeForTokens, {
                    lang: shikiLanguage,
                    theme: "dark-plus",
                }),
            )
            .then(({ tokens }) => {
                if (!cancelled) setTokens(tokens)
            })
            .catch(() => {
                if (!cancelled) setTokens([])
            })

        return () => {
            cancelled = true
        }
    }, [codeForTokens, shikiLanguage])

    if (!tokens?.length) return code

    return tokens.map((line, lineIndex) => (
        <span key={lineIndex} className="block min-h-5">
            {line.map((token, tokenIndex) => (
                <span key={tokenIndex} style={{ color: token.color }}>
                    {token.content}
                </span>
            ))}
        </span>
    ))
}

function syntaxColor(token: string, language: string, vscode: boolean) {
    const lower = language.toLowerCase()
    const colors = vscode ? syntaxColors.vscode : syntaxColors.discord

    if (
        syntaxLanguages.css.has(lower) &&
        (token.startsWith("#") || token.startsWith("--"))
    ) {
        return colors.css
    }
    if (
        token.startsWith("//") ||
        token.startsWith("/*") ||
        token.startsWith("<!--") ||
        (syntaxLanguages.python.has(lower) && token.startsWith("#"))
    ) {
        return colors.comment
    }
    if (/^['"`]/.test(token)) return colors.string
    if (/^\d/.test(token) || /^-?\d/.test(token)) return colors.number
    if (
        token === "true" ||
        token === "false" ||
        token === "null" ||
        token === "None"
    ) {
        return colors.keyword
    }
    if (syntaxLanguages.html.has(lower) && token.startsWith("<")) {
        return colors.tag
    }
    return colors.keyword
}

function SyntaxCode({
    code,
    language,
    vscode,
}: {
    code: string
    language: string
    vscode: boolean
}) {
    const normalizedLanguage = language.trim().toLowerCase()
    const supported = Object.values(syntaxLanguages).some((languages) =>
        languages.has(normalizedLanguage),
    )
    if (!supported) return code

    const pattern = syntaxLanguages.html.has(normalizedLanguage)
        ? /(<!--[\s\S]*?-->|<\/?[\w-]+(?:\s+[\w-]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*\/?>)/g
        : syntaxLanguages.css.has(normalizedLanguage)
          ? /(\/\*[\s\S]*?\*\/|#[\da-fA-F]{3,8}\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:--?[\w-]+|[\w-]+)(?=\s*:)|\b-?\d+(?:\.\d+)?(?:px|rem|em|%|s|deg)?\b)/g
          : syntaxLanguages.json.has(normalizedLanguage)
            ? /("(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/gi
            : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:true|false|null|None)\b|-?\d+(?:\.\d+)?|\b(?:as|async|await|break|class|const|def|else|export|for|from|function|if|import|in|let|new|return|self|this|try|type|while)\b)/g

    const nodes: ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    let index = 0

    while ((match = pattern.exec(code))) {
        if (match.index > lastIndex) {
            nodes.push(code.slice(lastIndex, match.index))
        }
        nodes.push(
            <span
                key={index++}
                style={{
                    color: syntaxColor(match[0], normalizedLanguage, vscode),
                }}
            >
                {match[0]}
            </span>,
        )
        lastIndex = pattern.lastIndex
    }

    if (lastIndex < code.length) nodes.push(code.slice(lastIndex))
    return nodes
}

function Spoiler({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState(false)

    return (
        <button
            type="button"
            title={visible ? "Hide spoiler" : "Reveal spoiler"}
            onClick={() => setVisible(!visible)}
            className={`inline cursor-pointer rounded px-1 transition-colors ${
                visible
                    ? "bg-neutral-500/40 text-neutral-100"
                    : "bg-neutral-900 text-neutral-900 hover:bg-neutral-700 hover:text-neutral-700"
            }`}
        >
            {children}
        </button>
    )
}

interface GuideItem {
    label: string
    syntax: string
    description: string
}

interface GuideSection {
    title: string
    description: string
    items: GuideItem[]
}

const guideSections: GuideSection[] = [
    {
        title: "Text styles",
        description: "Wrap text to add emphasis.",
        items: [
            {
                label: "Bold",
                syntax: "**text**",
                description: "Strong emphasis",
            },
            {
                label: "Italic",
                syntax: "*text* or _text_",
                description: "Either marker works",
            },
            {
                label: "Bold italic",
                syntax: "***text***",
                description: "Combine both styles",
            },
            {
                label: "Underline",
                syntax: "__text__",
                description: "Underline text",
            },
            {
                label: "Strikethrough",
                syntax: "~~text~~",
                description: "Cross out text",
            },
            {
                label: "Spoiler",
                syntax: "||text||",
                description: "Click to reveal",
            },
        ],
    },
    {
        title: "Structure",
        description: "Organize longer messages and announcements.",
        items: [
            {
                label: "Headers",
                syntax: "# H1 · ## H2 · ### H3",
                description: "Start a new line",
            },
            {
                label: "Subtext",
                syntax: "-# text",
                description: "Small supporting text",
            },
            {
                label: "Bulleted list",
                syntax: "- item or * item",
                description: "A space is required",
            },
            {
                label: "Numbered list",
                syntax: "1. item",
                description: "A space is required",
            },
            {
                label: "Nested list",
                syntax: "  - item",
                description: "Indent with two spaces",
            },
            {
                label: "Quote",
                syntax: "> text or >>> text",
                description: "Single or multi-line",
            },
        ],
    },
    {
        title: "Code and links",
        description: "Preserve text, add colors, or link cleanly.",
        items: [
            {
                label: "Inline code",
                syntax: "`text` or ``text``",
                description: "Single or double backticks",
            },
            {
                label: "Code block",
                syntax: "```\ncode\n```",
                description: "Preserves spacing",
            },
            {
                label: "Syntax colors",
                syntax: "```language",
                description: "Add a language label",
            },
            {
                label: "ANSI colors",
                syntax: "```ansi",
                description: "Use ANSI escape codes",
            },
            {
                label: "Masked link",
                syntax: "[label](https://...)",
                description: "Clickable label",
            },
            {
                label: "No link embed",
                syntax: "<https://...>",
                description: "Suppresses the preview",
            },
            {
                label: "Escape markdown",
                syntax: "\\*literal asterisks\\*",
                description: "Show formatting marks",
            },
        ],
    },
    {
        title: "Discord references",
        description: "Use IDs for exact Discord targets.",
        items: [
            {
                label: "User mention",
                syntax: "<@userId>",
                description: "Mention a user",
            },
            {
                label: "Role mention",
                syntax: "<@&roleId>",
                description: "Mention a role",
            },
            {
                label: "Channel mention",
                syntax: "<#channelId>",
                description: "Link to a channel",
            },
            {
                label: "Timestamp",
                syntax: "<t:unix:style>",
                description: "Timezone-aware time",
            },
            {
                label: "Custom emoji",
                syntax: "<:name:emojiId>",
                description: "Use an emoji by ID",
            },
        ],
    },
]

function FormattingGuide() {
    return (
        <Box compact className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <h2 className="font-medium text-neutral-800 dark:text-neutral-200">
                    Discord formatting reference
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Every common message syntax in one place. Copy the pattern,
                    then replace its placeholder text or ID.
                </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                {guideSections.map((section) => (
                    <section
                        key={section.title}
                        className="rounded-xl bg-zinc-200/70 p-4 dark:bg-zinc-800/70"
                    >
                        <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {section.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            {section.description}
                        </p>
                        <ul className="mt-3 flex flex-col divide-y divide-zinc-300 dark:divide-zinc-700">
                            {section.items.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 first:pt-0 last:pb-0"
                                >
                                    <span className="min-w-28 text-sm text-neutral-700 dark:text-neutral-300">
                                        {item.label}
                                    </span>
                                    <code className="min-w-0 rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs break-all text-neutral-700 dark:bg-zinc-900 dark:text-neutral-300">
                                        {item.syntax}
                                    </code>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {item.description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </Box>
    )
}

function DiscordMention({
    kind,
    id,
}: {
    kind: "user" | "role" | "channel"
    id: string
}) {
    const label =
        kind === "channel" ? "#channel" : kind === "role" ? "@role" : "@user"

    return (
        <span
            title={`${kind[0].toUpperCase()}${kind.slice(1)} ID: ${id}`}
            className="rounded bg-[#5865f2]/30 px-0.5 font-medium text-[#c9cdfb]"
        >
            {label}
        </span>
    )
}

function DiscordEmoji({
    name,
    id,
    animated,
}: {
    name: string
    id: string
    animated: boolean
}) {
    const extension = animated ? "gif" : "webp"

    return (
        <img
            src={`https://cdn.discordapp.com/emojis/${id}.${extension}?size=28`}
            alt={`:${name}:`}
            title={`:${name}:`}
            width={22}
            height={22}
            draggable={false}
            className="inline-block size-[1.375em] object-contain align-[-0.25em]"
        />
    )
}

function formatDiscordTimestamp(date: Date, style: string, now: number) {
    if (style === "R") {
        const difference = date.getTime() - now
        const units = [
            { unit: "year" as const, milliseconds: 31_536_000_000 },
            { unit: "month" as const, milliseconds: 2_592_000_000 },
            { unit: "week" as const, milliseconds: 604_800_000 },
            { unit: "day" as const, milliseconds: 86_400_000 },
            { unit: "hour" as const, milliseconds: 3_600_000 },
            { unit: "minute" as const, milliseconds: 60_000 },
            { unit: "second" as const, milliseconds: 1_000 },
        ]
        const relativeUnit =
            units.find(
                ({ milliseconds }) => Math.abs(difference) >= milliseconds,
            ) ?? units.at(-1)!

        return new Intl.RelativeTimeFormat(undefined, {
            numeric: "auto",
        }).format(
            Math.round(difference / relativeUnit.milliseconds),
            relativeUnit.unit,
        )
    }

    const options: Intl.DateTimeFormatOptions =
        style === "t"
            ? { timeStyle: "short" }
            : style === "T"
              ? { timeStyle: "medium" }
              : style === "d"
                ? { dateStyle: "short" }
                : style === "D"
                  ? { dateStyle: "long" }
                  : style === "F"
                    ? { dateStyle: "full", timeStyle: "short" }
                    : { dateStyle: "long", timeStyle: "short" }

    return new Intl.DateTimeFormat(undefined, options).format(date)
}

function DiscordTimestamp({
    seconds,
    style,
}: {
    seconds: number
    style: string
}) {
    const [now, setNow] = useState<number | null>(null)
    const date = new Date(seconds * 1_000)

    useEffect(() => {
        setNow(Date.now())

        if (style !== "R") return

        const interval = window.setInterval(() => setNow(Date.now()), 60_000)
        return () => window.clearInterval(interval)
    }, [style])

    if (Number.isNaN(date.getTime())) return <>{`<t:${seconds}:${style}>`}</>

    const source = `<t:${seconds}${style ? `:${style}` : ""}>`
    const title =
        now === null
            ? source
            : new Intl.DateTimeFormat(undefined, {
                  dateStyle: "full",
                  timeStyle: "long",
              }).format(date)

    return (
        <span
            title={title}
            className="rounded bg-[#414349] px-0.5 text-[#dbdee1]"
        >
            {now === null ? source : formatDiscordTimestamp(date, style, now)}
        </span>
    )
}

function renderInline(value: string, prefix = "inline"): ReactNode[] {
    const pattern =
        /(\\[\\`*_[\]{}()#+.!|~<>-]|<https?:\/\/[^>\s]+>|<a?:[\w-]+:\d+>|<@&\d+>|<@!?\d+>|<#\d+>|<t:\d+(?::[tTdDfFR])?>|\[[^\]]+]\(https?:\/\/[^)\s]+\)|``[\s\S]*?``|`[^`]*`|\|\|[\s\S]*?\|\||\*\*\*[\s\S]*?\*\*\*|\*\*[\s\S]*?\*\*|__[\s\S]*?__|~~[\s\S]*?~~|\*[^*\n]+\*|_[^_\n]+_)/g
    const nodes: ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    let index = 0

    while ((match = pattern.exec(value))) {
        if (match.index > lastIndex) {
            nodes.push(value.slice(lastIndex, match.index))
        }

        const token = match[0]
        const key = `${prefix}-${index++}`

        if (token.startsWith("\\")) {
            nodes.push(token.slice(1))
        } else if (/^<a?:[\w-]+:\d+>$/.test(token)) {
            const emoji = token.match(/^<(a?):([\w-]+):(\d+)>$/)
            if (emoji) {
                nodes.push(
                    <DiscordEmoji
                        key={key}
                        animated={emoji[1] === "a"}
                        name={emoji[2]}
                        id={emoji[3]}
                    />,
                )
            }
        } else if (/^<@&\d+>$/.test(token)) {
            nodes.push(
                <DiscordMention
                    key={key}
                    kind="role"
                    id={token.slice(3, -1)}
                />,
            )
        } else if (/^<@!?\d+>$/.test(token)) {
            nodes.push(
                <DiscordMention
                    key={key}
                    kind="user"
                    id={token.replace(/^<@!?|>$/g, "")}
                />,
            )
        } else if (/^<#\d+>$/.test(token)) {
            nodes.push(
                <DiscordMention
                    key={key}
                    kind="channel"
                    id={token.slice(2, -1)}
                />,
            )
        } else if (/^<t:\d+(?::[tTdDfFR])?>$/.test(token)) {
            const timestamp = token.match(/^<t:(\d+)(?::([tTdDfFR]))?>$/)
            if (timestamp) {
                nodes.push(
                    <DiscordTimestamp
                        key={key}
                        seconds={Number(timestamp[1])}
                        style={timestamp[2] ?? ""}
                    />,
                )
            }
        } else if (token.startsWith("<https://")) {
            const url = token.slice(1, -1)
            nodes.push(
                <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline"
                >
                    {url}
                </a>,
            )
        } else if (token.startsWith("[")) {
            const link = token.match(/^\[([^\]]+)]\((https?:\/\/[^)\s]+)\)$/)
            if (link) {
                nodes.push(
                    <a
                        key={key}
                        href={link[2]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline"
                    >
                        {renderInline(link[1], `${key}-link`)}
                    </a>,
                )
            } else {
                nodes.push(token)
            }
        } else if (token.startsWith("`")) {
            const delimiterLength = token.startsWith("``") ? 2 : 1
            nodes.push(
                <code
                    key={key}
                    className="rounded bg-black/35 px-1 py-0.5 font-mono text-[0.9em] text-neutral-100"
                >
                    {token.slice(delimiterLength, -delimiterLength)}
                </code>,
            )
        } else if (token.startsWith("||")) {
            nodes.push(
                <Spoiler key={key}>
                    {renderInline(token.slice(2, -2), `${key}-spoiler`)}
                </Spoiler>,
            )
        } else if (token.startsWith("***")) {
            nodes.push(
                <strong key={key}>
                    <em>{renderInline(token.slice(3, -3), `${key}-both`)}</em>
                </strong>,
            )
        } else if (token.startsWith("**")) {
            nodes.push(
                <strong key={key}>
                    {renderInline(token.slice(2, -2), `${key}-bold`)}
                </strong>,
            )
        } else if (token.startsWith("__")) {
            nodes.push(
                <span key={key} className="underline">
                    {renderInline(token.slice(2, -2), `${key}-underline`)}
                </span>,
            )
        } else if (token.startsWith("~~")) {
            nodes.push(
                <span key={key} className="line-through">
                    {renderInline(token.slice(2, -2), `${key}-strike`)}
                </span>,
            )
        } else {
            nodes.push(
                <em key={key}>
                    {renderInline(token.slice(1, -1), `${key}-italic`)}
                </em>,
            )
        }

        lastIndex = pattern.lastIndex
    }

    if (lastIndex < value.length) nodes.push(value.slice(lastIndex))
    return nodes
}

function TextBlock({ text }: { text: string }) {
    const quoteAll = text.startsWith(">>> ")
    const lines = (quoteAll ? text.slice(4) : text).split("\n")

    return (
        <div className="flex flex-col gap-1.5">
            {lines.map((line, index) => {
                const key = `${line}-${index}`
                const header = line.match(/^(#{1,3})\s+(.+)$/)
                const quote = line.match(/^>\s+(.+)$/)
                const subtext = line.match(/^-#\s+(.+)$/)
                const list = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/)

                if (quoteAll || quote) {
                    return (
                        <blockquote
                            key={key}
                            className="border-l-4 border-neutral-500 pl-3 text-neutral-300"
                        >
                            {renderInline(
                                quoteAll ? line : (quote?.[1] ?? key),
                            )}
                        </blockquote>
                    )
                }
                if (header) {
                    const classes = [
                        "text-xl font-bold",
                        "text-lg font-bold",
                        "font-bold",
                    ]
                    return (
                        <div
                            key={key}
                            className={classes[header[1].length - 1]}
                        >
                            {renderInline(header[2], key)}
                        </div>
                    )
                }
                if (subtext) {
                    return (
                        <div key={key} className="text-xs text-neutral-400">
                            {renderInline(subtext[1], key)}
                        </div>
                    )
                }
                if (list) {
                    return (
                        <div
                            key={key}
                            style={{
                                paddingLeft: `${list[1].length * 0.75}rem`,
                            }}
                        >
                            <span className="mr-2 text-neutral-400">
                                {list[2]}
                            </span>
                            {renderInline(list[3], key)}
                        </div>
                    )
                }
                if (!line) return <div key={key} className="h-2" />

                return <div key={key}>{renderInline(line, key)}</div>
            })}
        </div>
    )
}

function Preview({
    value,
    showSyntax,
    vscode,
    shiki,
}: {
    value: string
    showSyntax: boolean
    vscode: boolean
    shiki: boolean
}) {
    const blocks = value.split(/(```[\s\S]*?```)/g).filter(Boolean)

    return (
        <div className="min-h-80 rounded-xl bg-[#313338] p-4 text-[15px] leading-6 text-[#dbdee1]">
            {blocks.length ? (
                <div className="flex flex-col gap-3">
                    {blocks.map((block, index) => {
                        if (!block.startsWith("```")) {
                            return <TextBlock key={index} text={block} />
                        }

                        const content = block.slice(3, -3)
                        const newline = content.indexOf("\n")
                        const language =
                            newline === -1 ? "" : content.slice(0, newline)
                        const code =
                            newline === -1
                                ? content
                                : content.slice(newline + 1)
                        const isAnsi = language.trim().toLowerCase() === "ansi"

                        return (
                            <div
                                key={index}
                                className={`overflow-hidden rounded-lg ${shiki || vscode ? "bg-[#1e1e1e]" : "bg-[#1e1f22]"}`}
                            >
                                {language && (
                                    <div className="border-b border-white/10 px-3 py-1.5 font-mono text-xs text-neutral-400">
                                        <LanguageBadge
                                            language={language}
                                            shiki={shiki && !isAnsi}
                                        />
                                    </div>
                                )}
                                <pre className="scrollbar-none overflow-x-auto p-3 font-mono text-sm leading-5 text-[#dbdee1] [&::-webkit-scrollbar]:hidden">
                                    {isAnsi ? (
                                        <AnsiText value={code} />
                                    ) : showSyntax && shiki ? (
                                        <ShikiCode
                                            code={code}
                                            language={language}
                                        />
                                    ) : showSyntax ? (
                                        <SyntaxCode
                                            code={code}
                                            language={language}
                                            vscode={vscode}
                                        />
                                    ) : (
                                        code
                                    )}
                                </pre>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <span className="text-neutral-400">
                    Your preview will appear here.
                </span>
            )}
        </div>
    )
}

function PreviewToggle({
    label,
    enabled,
    disabled = false,
    onChange,
}: {
    label: string
    enabled: boolean
    disabled?: boolean
    onChange: (enabled: boolean) => void
}) {
    return (
        <button
            type="button"
            aria-pressed={enabled}
            disabled={disabled}
            onClick={() => onChange(!enabled)}
            className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2 text-xs whitespace-nowrap transition-colors ${
                disabled
                    ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-neutral-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-neutral-600"
                    : enabled
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                      : "border-zinc-300 bg-zinc-100 text-neutral-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-neutral-400 dark:hover:bg-zinc-800"
            }`}
        >
            <span
                aria-hidden="true"
                className={`relative h-3.5 w-6 rounded-full transition-colors ${
                    enabled ? "bg-rose-500" : "bg-zinc-400 dark:bg-zinc-600"
                }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 size-2.5 rounded-full bg-white shadow-sm transition-transform ${
                        enabled ? "translate-x-3" : "translate-x-0"
                    }`}
                />
            </span>
            {label}
        </button>
    )
}

export default function DiscordMarkdownTool() {
    const [input, setInput] = useState(example)
    const [showSyntax, setShowSyntax] = useState(true)
    const [vscode, setVscode] = useState(true)
    const [shiki, setShiki] = useState(false)

    return (
        <div className="grid items-start gap-4 xl:grid-cols-2">
            <div className="flex flex-col gap-2">
                <div className="flex min-h-7 items-center justify-between">
                    <label htmlFor="discord-markdown" className={labelClass}>
                        Discord markdown
                    </label>
                    <CopyButton text={input} />
                </div>
                <Box compact>
                    <textarea
                        id="discord-markdown"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        rows={16}
                        spellCheck={false}
                        className={`${fieldClass} resize-y scrollbar-none font-mono leading-5 [&::-webkit-scrollbar]:hidden`}
                    />
                </Box>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
                    <span className={labelClass}>Discord preview</span>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <PreviewToggle
                            label="Syntax highlighting"
                            enabled={showSyntax}
                            onChange={setShowSyntax}
                        />
                        <PreviewToggle
                            label="VS Code Dark+"
                            enabled={vscode}
                            disabled={!showSyntax}
                            onChange={setVscode}
                        />
                        <PreviewToggle
                            label="Shiki codeblocks"
                            enabled={shiki}
                            disabled={!showSyntax}
                            onChange={setShiki}
                        />
                    </div>
                </div>
                <Preview
                    value={input}
                    showSyntax={showSyntax}
                    vscode={vscode}
                    shiki={shiki}
                />
            </div>

            <div className="xl:col-span-2">
                <FormattingGuide />
            </div>
        </div>
    )
}
