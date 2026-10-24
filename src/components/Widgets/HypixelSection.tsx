import { Pickaxe } from "lucide-react"
import Box from "@/components/Base/Box"
import Section from "@/components/Base/Section"
import { getHypixelStatus } from "@/lib/hypixel"

const rankColors: Record<string, string> = {
    VIP: "#55ff55",
    "VIP+": "#55ff55",
    MVP: "#55ffff",
    "MVP+": "#55ffff",
    "MVP++": "#ffaa00",
    Helper: "#5555ff",
    Moderator: "#00aa00",
    Admin: "#ff5555",
    YouTuber: "#ff5555",
}

export default async function HypixelSection() {
    const hypixel = await getHypixelStatus()
    if (!hypixel) return null

    const status = hypixel.online
        ? hypixel.game
            ? `Playing ${hypixel.game}`
            : "Online on Hypixel"
        : "Offline"

    return (
        <Section icon={Pickaxe} title="Hypixel">
            <Box compact className="flex flex-col gap-3">
                <a
                    href={`https://plancke.io/hypixel/player/stats/${encodeURIComponent(hypixel.username)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4"
                >
                    <img
                        src={`https://mc-heads.net/avatar/${hypixel.uuid}/56`}
                        alt={`${hypixel.username}'s avatar`}
                        width={56}
                        height={56}
                        draggable={false}
                        className="image-rendering-pixelated size-14 rounded-lg"
                    />

                    <div className="flex min-w-0 flex-col">
                        <span className="flex items-center gap-2 truncate text-lg font-medium text-neutral-800 group-hover:text-rose-500 dark:text-neutral-200">
                            <span className="truncate">{hypixel.username}</span>
                            {hypixel.rank && (
                                <span
                                    className="shrink-0 rounded px-1.5 py-0.5 text-xs font-bold text-zinc-950"
                                    style={{
                                        backgroundColor:
                                            rankColors[hypixel.rank] ??
                                            "#949ba4",
                                    }}
                                >
                                    {hypixel.rank}
                                </span>
                            )}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <span
                                className="size-2.5 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: hypixel.online
                                        ? "#55ff55"
                                        : "#949ba4",
                                }}
                            />
                            {status}
                        </span>
                        {hypixel.map && (
                            <span className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                                {hypixel.map}
                            </span>
                        )}
                    </div>
                </a>
            </Box>
        </Section>
    )
}
