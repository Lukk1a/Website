import { Gamepad2 } from "lucide-react"
import Box from "@/components/Base/Box"
import Section from "@/components/Base/Section"
import { getSteamStatus } from "@/lib/steam"

const stateLabels = {
    online: "Online",
    offline: "Offline",
    "in-game": "In game",
}

const stateColors = {
    online: "#57cbde",
    offline: "#949ba4",
    "in-game": "#90ba3c",
}

export default async function SteamSection() {
    const steam = await getSteamStatus()
    if (!steam) return null

    return (
        <Section icon={Gamepad2} title="Steam">
            <Box compact>
                <a
                    href={steam.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 transition-transform duration-200"
                >
                    {steam.avatar && (
                        <img
                            src={steam.avatar}
                            alt={`${steam.name}'s Steam avatar`}
                            width={56}
                            height={56}
                            draggable={false}
                            className="size-14 rounded-lg select-none transition-transform duration-300 group-hover:scale-105"
                        />
                    )}

                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-lg font-medium text-neutral-800 group-hover:text-rose-500 dark:text-neutral-200">
                            {steam.name}
                        </span>

                        <span className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <span
                                className="size-2.5 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: stateColors[steam.state],
                                }}
                            />
                            {steam.game
                                ? `Playing ${steam.game.name}`
                                : stateLabels[steam.state]}
                        </span>
                    </div>

                    {steam.game?.icon && (
                        <img
                            src={steam.game.icon}
                            alt={`${steam.game.name} icon`}
                            width={40}
                            height={40}
                            draggable={false}
                            className="ml-auto size-10 shrink-0 rounded-md select-none"
                        />
                    )}
                </a>
            </Box>
        </Section>
    )
}
