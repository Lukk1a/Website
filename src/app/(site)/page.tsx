import Link from "next/link"
import {
    ArrowRight,
    Activity,
    Hammer,
    Highlighter,
    Share2,
    Users,
} from "lucide-react"
import { bio, displayName, projects } from "@/consts"
import { createMetadata } from "@/lib/metadata"
import { isActive } from "@/lib/projects"
import Section from "@/components/Base/Section"
import ProjectGrid from "@/components/Cards/ProjectGrid"
import Friends from "@/components/Profile/Friends"
import DiscordEmbed from "@/components/Layout/DiscordEmbed"
import Hero from "@/components/Profile/Hero"
import Socials from "@/components/Profile/Socials"
import LiveWidgets from "@/components/Widgets/LiveWidgets"

export const revalidate = 3600

export const metadata = createMetadata({
    title: displayName,
    description:
        bio,
    path: "/",
})

export default function Home() {
    const current = projects.filter(isActive)

    return (
        <>
            <DiscordEmbed />

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
                <Section icon={Highlighter} title="Me">
                    <Hero />
                </Section>

                <Section icon={Activity} title="Live">
                    <LiveWidgets className="xl:grid-cols-1" />
                </Section>
            </div>

            <Section
                icon={Hammer}
                title="Currently building"
                action={
                    <Link
                        href="/projects"
                        className="flex items-center gap-1 hover:text-rose-500"
                    >
                        All projects <ArrowRight size={14} />
                    </Link>
                }
            >
                <ProjectGrid projects={current} />
            </Section>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <Section icon={Share2} title="Find me">
                    <Socials />
                </Section>

                <Section icon={Users} title="Friends">
                    <Friends />
                </Section>
            </div>
        </>
    )
}
