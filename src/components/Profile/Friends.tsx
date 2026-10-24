import { friends } from "@/consts"
import FriendCard from "@/components/Cards/FriendCard"
import Box from "@/components/Base/Box"

export default function Friends() {
    if (friends.length === 0) {
        return (
            <Box compact className="flex flex-1 items-center justify-center p-6 text-sm text-neutral-500 dark:text-neutral-400">
                No friends listed yet.
            </Box>
        )
    }

    return (
        <Box compact className="relative flex-1 lg:p-0">
            <div className="scrollbar-none lg:absolute lg:inset-0 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="flex min-h-full flex-col justify-center gap-0.5 lg:px-5 lg:py-2">
                    {friends.map((friend) => (
                        <FriendCard key={friend.id} {...friend} />
                    ))}
                </div>
            </div>
        </Box>
    )
}
