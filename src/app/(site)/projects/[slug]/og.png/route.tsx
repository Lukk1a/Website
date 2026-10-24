import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import { projects } from "@/consts"
import { getProject, isActive, yearRange } from "@/lib/projects"
import { excerpt } from "@/lib/text"

export function generateStaticParams() {
    return projects.map(({ slug }) => ({ slug }))
}

async function readIcon(icon?: string) {
    if (!icon) return null
    try {
        const file = await readFile(path.join(process.cwd(), "public", icon))
        return `data:image/png;base64,${file.toString("base64")}`
    } catch {
        return null
    }
}

const pill = {
    padding: "8px 24px",
    borderRadius: 999,
    background: "#27272a",
    color: "#e5e5e5",
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const project = getProject((await params).slug)
    if (!project) return new Response("Not found", { status: 404 })

    const icon = await readIcon(project.icon)
    const active = isActive(project)

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#09090b",
                color: "#e5e5e5",
            }}
        >
            <div
                style={{
                    height: 10,
                    background: "linear-gradient(90deg, #9f1239, #f43f5e)",
                }}
            />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "64px 80px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 32,
                        }}
                    >
                        {icon && (
                            <img
                                src={icon}
                                alt=""
                                width={128}
                                height={128}
                                style={{ borderRadius: 24 }}
                            />
                        )}
                        <div
                            style={{
                                fontSize: 84,
                                fontWeight: 700,
                                color: "#fafafa",
                            }}
                        >
                            {project.title}
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: 40,
                            fontSize: 34,
                            lineHeight: 1.4,
                            color: "#a1a1aa",
                        }}
                    >
                        {excerpt(project.description, 170)}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 30,
                        color: "#a1a1aa",
                    }}
                >
                    <div style={{ display: "flex", gap: 16 }}>
                        <span
                            style={{
                                ...pill,
                                background: active ? "#064e3b" : "#27272a",
                            }}
                        >
                            {`${active ? "Active" : "Past"} · ${yearRange(project)}`}
                        </span>
                        {project.tags?.slice(0, 2).map((tag) => (
                            <span key={tag} style={pill}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span>lukka.dev</span>
                </div>
            </div>
        </div>,
        { width: 1200, height: 630 },
    )
}
