import { Cpu, Globe, Network, Server } from "lucide-react"
import Box from "@/components/Base/Box"
import Tag from "@/components/Base/Tag"

interface SkillGroup {
    title: string
    icon: typeof Cpu
    description: string
    skills: string[]
}

const skillGroups: SkillGroup[] = [
    {
        title: "Native Systems",
        icon: Cpu,
        description:
            "Low-level architectures, concurrency, and performance optimization.",
        skills: [
            "C++20",
            "SIMD / AVX2",
            "CMake",
            "Low-Latency Concurrency",
            "Memory Layout",
            "x86_64 ASM",
        ],
    },
    {
        title: "Web Platforms",
        icon: Globe,
        description:
            "Modern web applications, reactive state, and fullstack APIs.",
        skills: [
            "TypeScript",
            "React 19",
            "Next.js",
            "Node.js",
            "Tailwind CSS",
            "Zustand",
        ],
    },
    {
        title: "Netcode & Simulation",
        icon: Network,
        description:
            "Multiplayer replication, physics sync, and engine systems.",
        skills: [
            "Luau / Roblox",
            "Delta Compression",
            "State Machines",
            "Replicated UDP",
            "Spatial Indexing",
        ],
    },
    {
        title: "DevOps & Infrastructure",
        icon: Server,
        description:
            "Containerization, CI/CD automation, and Linux server management.",
        skills: [
            "Docker",
            "Linux / POSIX",
            "GitHub Actions",
            "CI/CD Pipelines",
            "Reverse Proxies",
        ],
    },
]

export default function Skills() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group) => {
                const Icon = group.icon
                return (
                    <Box
                        key={group.title}
                        compact
                        className="flex flex-col justify-between transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700"
                    >
                        <div>
                            <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                                <Icon size={18} className="text-rose-500" />
                                <span>{group.title}</span>
                            </div>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {group.description}
                            </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {group.skills.map((skill) => (
                                <Tag
                                    key={skill}
                                    className="transition-transform duration-150 hover:scale-105"
                                >
                                    {skill}
                                </Tag>
                            ))}
                        </div>
                    </Box>
                )
            })}
        </div>
    )
}
