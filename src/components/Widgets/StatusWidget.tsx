"use client"

import { BookOpen, CircleDot } from "lucide-react"
import { useProfile } from "@/lib/profile"
import { statusColors, statusLabels } from "@/lib/status"
import Widget from "./Widget"

const listFormat = new Intl.ListFormat("en", { type: "conjunction" })

export default function StatusWidget() {
    const { lanyard } = useProfile()

    const status = lanyard?.discord_status || "offline"
    const customStatus = lanyard?.activities?.find((a) => a.type === 4)?.state

    const platforms: string[] = []
    if (lanyard?.active_on_discord_desktop) platforms.push("Desktop")
    if (lanyard?.active_on_discord_mobile) platforms.push("Mobile")
    if (lanyard?.active_on_discord_web) platforms.push("Web")
    if (lanyard?.active_on_discord_embedded) platforms.push("Console")
    if (lanyard?.active_on_discord_vr) platforms.push("VR")

    return (
        <Widget icon={CircleDot} title="Status">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="relative flex size-3 shrink-0 items-center justify-center">
                        {status === "online" && (
                            <span
                                className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
                                style={{ backgroundColor: statusColors[status] }}
                            />
                        )}
                        <span
                            className="relative inline-flex size-3 rounded-full"
                            style={{ backgroundColor: statusColors[status] }}
                        />
                    </span>
                    <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                        {statusLabels[status] ?? statusLabels.offline}
                    </span>
                </div>

                {platforms.length > 0 && (
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        on {listFormat.format(platforms)}
                    </span>
                )}
            </div>

            {customStatus && (
                <p className="flex items-start gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                    <BookOpen size={16} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 wrap-break-word">
                        {customStatus}
                    </span>
                </p>
            )}
        </Widget>
    )
}
