import Avatar from "@/components/Base/Avatar"
import Box from "@/components/Base/Box"
import Tag from "@/components/Base/Tag"
import Badges from "@/components/Profile/Badges"
import ClanTag from "@/components/Profile/ClanTag"
import { bio, displayName, information } from "@/consts"

export default function Hero() {
    return (
        <Box className="flex flex-1 flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
            <div className="shrink-0">
                <Avatar size={176} />
            </div>

            <div className="flex min-w-0 flex-col items-center gap-3 text-center md:items-start md:text-left">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                        {displayName}
                    </h1>
                    <ClanTag />
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    {information.map((info) => (
                        <Tag key={info.text}>
                            <info.icon size={14} />
                            {info.text}
                        </Tag>
                    ))}
                </div>

                <p className="max-w-prose text-neutral-600 dark:text-neutral-400">
                    {bio}
                </p>

                <Badges />
            </div>
        </Box>
    )
}
