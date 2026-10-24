import Github from "@/components/Icons/Github"
import { githubUser, socials } from "@/consts"
import Box from "@/components/Base/Box"

export default function Socials() {
    return (
        <div className="flex flex-1 flex-wrap gap-3">
            <a
                href={`https://github.com/${githubUser}`}
                target="_blank"
                rel="noreferrer"
                className="group relative flex grow items-center gap-3 overflow-hidden rounded-2xl bg-linear-to-br from-rose-500 to-rose-800 px-8 py-5 text-white shadow-lg ring-1 shadow-rose-950/30 ring-white/15 transition-all ring-inset hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[.98] sm:grow-0 sm:flex-col sm:justify-center sm:gap-2 sm:text-center"
            >
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-110">
                    <Github size={20} className="fill-current" />
                </span>

                <span className="relative flex flex-col">
                    <span className="text-base font-semibold">GitHub</span>
                    <span className="text-xs text-rose-100/80">
                        @{githubUser}
                    </span>
                </span>

                <Github
                    size={120}
                    className="absolute -right-6 -bottom-8 opacity-10 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-rotate-6"
                />
            </a>

            <Box
                compact
                className="grid grow basis-72 grid-cols-2 content-center gap-2 sm:grid-cols-3"
            >
                {socials
                    .filter((social) => social.text !== "Donate" && social.text !== "GitHub")
                    .map((social) => (
                        <a
                            key={social.text}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-zinc-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-zinc-300 hover:text-rose-500 dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700/70"
                        >
                            <social.icon size={18} />
                            {social.text}
                        </a>
                    ))}
            </Box>
        </div>
    )
}
