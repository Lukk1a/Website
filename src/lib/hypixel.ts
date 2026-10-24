import { liveRefreshSeconds, mcUsername, mcUuid } from "@/consts"

const GAME_NAMES: Record<string, string> = {
    ARCADE: "Arcade Games",
    BEDWARS: "Bed Wars",
    BUILD_BATTLE: "Build Battle",
    CLASSIC_GAMES: "Classic Games",
    DUELS: "Duels",
    HOUSING: "Housing",
    MAIN_LOBBY: "a lobby",
    MURDER_MYSTERY: "Murder Mystery",
    PIT: "The Pit",
    PROTOTYPE: "Prototype Lobby",
    QUAKECRAFT: "Quakecraft",
    SKYWARS: "SkyWars",
    SKYBLOCK: "SkyBlock",
    SMP: "SMP",
    SURVIVAL_GAMES: "Blitz Survival Games",
    TNTGAMES: "The TNT Games",
    UHC: "UHC Champions",
    VAMPIREZ: "VampireZ",
    WALLS3: "Mega Walls",
    WALLS: "The Walls",
    WOOL_GAMES: "Wool Games",
}

export interface HypixelStatus {
    username: string
    uuid: string
    rank: string | null
    online: boolean
    game: string | null
    map: string | null
}

function record(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

function string(value: unknown) {
    return typeof value === "string" && value ? value : null
}

function formatGame(gameType: string | null) {
    if (!gameType) return null

    return (
        GAME_NAMES[gameType] ??
        gameType
            .toLowerCase()
            .split("_")
            .map((word) => word[0]?.toUpperCase() + word.slice(1))
            .join(" ")
    )
}

function formatRank(player: Record<string, unknown> | null) {
    if (!player) return null

    const specialRank = string(player.rank)
    if (specialRank && specialRank !== "NORMAL") {
        return specialRank
            .toLowerCase()
            .split("_")
            .map((word) => word[0]?.toUpperCase() + word.slice(1))
            .join(" ")
    }

    const packageRank =
        string(player.monthlyPackageRank) === "SUPERSTAR"
            ? "SUPERSTAR"
            : (string(player.newPackageRank) ?? string(player.packageRank))

    return (
        {
            VIP: "VIP",
            VIP_PLUS: "VIP+",
            MVP: "MVP",
            MVP_PLUS: "MVP+",
            SUPERSTAR: "MVP++",
        }[packageRank ?? ""] ?? null
    )
}

export async function getHypixelStatus(): Promise<HypixelStatus | null> {
    const apiKey = process.env.HYPIXEL_API_KEY
    const uuid = mcUuid.replaceAll("-", "").toLowerCase()
    if (!apiKey || !/^[\da-f]{32}$/.test(uuid)) return null

    try {
        const params = new URLSearchParams({ uuid })
        const options = (revalidate: number) => ({
            headers: { "API-Key": apiKey },
            cache: "force-cache" as const,
            next: { revalidate },
            signal: AbortSignal.timeout(8000),
        })
        const [statusResponse, playerResponse] = await Promise.all([
            fetch(
                `https://api.hypixel.net/v2/status?${params}`,
                options(liveRefreshSeconds),
            ),
            fetch(`https://api.hypixel.net/v2/player?${params}`, options(3600)),
        ])
        if (!statusResponse.ok || !playerResponse.ok) {
            throw new Error(
                `Hypixel responded ${statusResponse.status}/${playerResponse.status}`,
            )
        }

        const [statusJson, playerJson]: unknown[] = await Promise.all([
            statusResponse.json(),
            playerResponse.json(),
        ])
        if (
            !record(statusJson) ||
            statusJson.success !== true ||
            !record(playerJson) ||
            playerJson.success !== true
        ) {
            return null
        }

        const session = record(statusJson.session) ? statusJson.session : null
        const player = record(playerJson.player) ? playerJson.player : null
        const online = session?.online === true

        return {
            username: string(player?.displayname) ?? mcUsername,
            uuid,
            rank: formatRank(player),
            online,
            game: online ? formatGame(string(session?.gameType)) : null,
            map: online ? string(session?.map) : null,
        }
    } catch (error) {
        console.error("Error fetching Hypixel status:", error)
        return null
    }
}
