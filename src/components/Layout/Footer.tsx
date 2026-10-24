import { displayName } from "@/consts"

export default function Footer() {
    return (
        <footer className="flex flex-col items-center gap-2 px-3 py-12 text-center text-sm sm:flex-row sm:justify-between sm:gap-4 sm:text-left">
            <span className="text-neutral-600 dark:text-neutral-400">
                © {new Date().getFullYear()} {displayName}
            </span>

            <p className="text-neutral-600 dark:text-neutral-400">
                Made with 💗 by {displayName}.
            </p>
        </footer>
    )
}
