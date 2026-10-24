import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import Footer from "@/components/Layout/Footer"
import Header from "@/components/Layout/Header"
import { createMetadata } from "@/lib/metadata"
import { displayName } from "@/consts"

export const metadata = createMetadata({
    title: displayName,
    description: "Page not found.",
})

export default function NotFound() {
    return (
        <div className="flex min-h-dvh flex-col">
            <Header />

            <main className="flex flex-1 flex-col items-center justify-center gap-4 px-3 py-16">
                <p className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-200">
                    <TriangleAlert size={18} fill="#ffffff10" /> The page
                    you&apos;re looking for is not found!
                </p>

                <Link
                    href="/"
                    className="rounded-lg bg-rose-600 px-3 py-2 font-semibold text-white transition hover:bg-rose-500"
                >
                    Return
                </Link>
            </main>

            <Footer />
        </div>
    )
}
