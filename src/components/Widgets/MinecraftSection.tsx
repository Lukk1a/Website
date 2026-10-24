import { Pickaxe } from "lucide-react"
import Box from "@/components/Base/Box"
import Section from "@/components/Base/Section"
import { mcUsername, mcUuid } from "@/consts"
import { getCapes, type Cape } from "@/lib/capes"

const nameMcUrl = `https://namemc.com/profile/${encodeURIComponent(mcUsername)}`

const sides = [
    { label: "Front", query: "" },
    { label: "Back", query: "?back" },
]

function CapeFront({ cape }: { cape: Cape }) {
    // The front face of a cape texture is 10×16 pixels, starting one pixel in from the top left
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div
                role="img"
                aria-label={`${cape.provider} cape`}
                title={`${cape.provider} cape`}
                className="h-16 w-10 rounded-sm bg-no-repeat [image-rendering:pixelated]"
                style={{
                    backgroundImage: `url(${cape.url})`,
                    backgroundSize: `${cape.units * 4}px auto`,
                    backgroundPosition: "-4px -4px",
                }}
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {cape.provider}
            </span>
        </div>
    )
}

export default async function MinecraftSection() {
    const capes = await getCapes()

    return (
        <Section icon={Pickaxe} title="Minecraft">
            <Box
                compact
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
                <a
                    href={nameMcUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex shrink-0 justify-center gap-2"
                >
                    {sides.map(({ label, query }) => (
                        <img
                            key={label}
                            src={`https://skins.thororen.com/cheatbreaker/armor/body/${mcUuid}/200${query}`}
                            alt={`${label} of ${mcUsername}'s skin`}
                            width={80}
                            height={160}
                            draggable={false}
                            className="h-40 w-20 select-none [image-rendering:pixelated] transition-transform duration-300 hover:scale-105"
                        />
                    ))}
                </a>

                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-col">
                        <a
                            href={nameMcUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-fit truncate text-lg font-medium text-neutral-800 hover:text-rose-500 dark:text-neutral-200"
                        >
                            {mcUsername}
                        </a>
                    </div>

                    {capes.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                Capes
                            </span>
                            <div className="flex flex-wrap gap-4">
                                {capes.map((cape) => (
                                    <CapeFront
                                        key={cape.provider}
                                        cape={cape}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <a
                        href={nameMcUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit text-sm font-medium text-neutral-600 hover:text-rose-500 dark:text-neutral-400"
                    >
                        View on NameMC →
                    </a>
                </div>
            </Box>
        </Section>
    )
}
