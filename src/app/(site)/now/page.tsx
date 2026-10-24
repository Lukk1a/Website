import { GitCommitHorizontal } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import Section from "@/components/Base/Section"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import ActivityFeed from "@/components/Widgets/ActivityFeed"
import CodingSection from "@/components/Widgets/CodingSection"
import ListeningSection from "@/components/Widgets/ListeningSection"
import SteamSection from "@/components/Widgets/SteamSection"
import MinecraftSection from "@/components/Widgets/MinecraftSection"
import LiveRefresh from "@/components/Widgets/LiveRefresh"
import WatchingSection from "@/components/Widgets/WatchingSection"
import { liveRefreshSeconds } from "@/consts"

export const dynamic = "force-dynamic"

export const metadata = createMetadata({
    title: "Now",
    description:
        "What I'm up to right now: what I'm playing, listening to, watching and coding.",
    path: "/now",
})

export default function Now() {
    return (
        <>
            <DiscordEmbed page="now" />
            <LiveRefresh seconds={liveRefreshSeconds} />

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-8 empty:hidden">
                    <SteamSection />
                    <MinecraftSection />
                    <ListeningSection />
                    <WatchingSection />
                </div>

                <div className="flex flex-col gap-8 self-stretch">
                    <CodingSection />

                    <Section
                        icon={GitCommitHorizontal}
                        title="Recent activity"
                        className="flex-1"
                    >
                        <ActivityFeed />
                    </Section>
                </div>
            </div>
        </>
    )
}
