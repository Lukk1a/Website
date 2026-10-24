"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Nameplate from "@/components/Layout/Nameplate"
import ThemeToggle from "@/components/ThemeToggle"
import { displayName, navLinks } from "@/consts"
import { useProfile } from "@/lib/profile"

const iconButtonClass =
    "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 text-neutral-600 transition-transform hover:bg-zinc-300 active:scale-[.97] dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-200 dark:hover:bg-zinc-800"

export default function Header() {
    const pathname = usePathname()
    const { lanyard } = useProfile()
    const hasNameplate = !!lanyard?.discord_user?.collectibles?.nameplate?.asset
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (!menuOpen) return

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [menuOpen])

    const links = navLinks.map((link) => ({
        ...link,
        active:
            link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href),
    }))

    return (
        <header className="sticky top-0 z-40 px-3 pt-3">
            {menuOpen && (
                <div
                    aria-hidden
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 sm:hidden"
                />
            )}

            <div className="relative flex items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-100/90 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
                <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className={`group relative isolate flex items-center gap-2 overflow-hidden rounded-lg pr-2 font-semibold text-neutral-800 dark:text-neutral-200 ${
                        hasNameplate ? "sm:min-w-52 sm:py-1 sm:pl-1" : ""
                    }`}
                >
                    <img
                        src="/assets/profile"
                        alt=""
                        width={28}
                        height={28}
                        draggable={false}
                        className="rounded-full select-none"
                    />
                    <span>{displayName}</span>
                    <Nameplate />
                </Link>

                <nav className="ml-auto flex items-center gap-1 max-sm:hidden">
                    {links.map(({ text, href, icon: Icon, active }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-zinc-200 text-neutral-900 dark:bg-zinc-800 dark:text-neutral-100"
                                    : "text-neutral-600 hover:bg-zinc-200 dark:text-neutral-400 dark:hover:bg-zinc-800"
                            }`}
                        >
                            <Icon size={16} className="max-md:hidden" />
                            {text}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 max-sm:ml-auto">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                        className={`${iconButtonClass} sm:hidden`}
                    >
                        {menuOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                {menuOpen && (
                    <nav
                        id="mobile-nav"
                        className="absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-zinc-300 bg-zinc-100 p-2 shadow-lg sm:hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        {links.map(({ text, href, icon: Icon, active }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-lg px-3 py-3 font-medium transition-colors ${
                                    active
                                        ? "bg-zinc-200 text-neutral-900 dark:bg-zinc-800 dark:text-neutral-100"
                                        : "text-neutral-600 hover:bg-zinc-200 dark:text-neutral-400 dark:hover:bg-zinc-800"
                                }`}
                            >
                                <Icon size={18} />
                                {text}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    )
}
