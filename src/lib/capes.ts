import { mcUsername, mcUuid } from "@/consts"

export interface Cape {
    provider: string
    url: string
    // Texture width in cape-layout pixels: 64 for vanilla-style textures, 46 for OptiFine's cropped ones
    units: number
}

const optifineCapeUrl = `http://s.optifine.net/capes/${encodeURIComponent(mcUsername)}.png`

function record(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

function string(value: unknown) {
    return typeof value === "string" && value ? value : null
}

const options = () => ({
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(5000),
})

async function getJson(url: string): Promise<unknown> {
    const res = await fetch(url, options())
    if (!res.ok) throw new Error(`${url} responded ${res.status}`)
    return res.json()
}

async function getMinecraftCape(): Promise<Cape | null> {
    const profile = await getJson(
        `https://sessionserver.mojang.com/session/minecraft/profile/${mcUuid}`,
    )
    const properties =
        record(profile) && Array.isArray(profile.properties)
            ? profile.properties
            : []
    const textures = properties.find(
        (property) => record(property) && property.name === "textures",
    )
    const value = record(textures) ? string(textures.value) : null
    if (!value) return null

    const decoded: unknown = JSON.parse(Buffer.from(value, "base64").toString())
    const cape =
        record(decoded) && record(decoded.textures)
            ? decoded.textures.CAPE
            : null
    const url = record(cape) ? string(cape.url) : null

    return url
        ? {
              provider: "Minecraft",
              url: url.replace(/^http:/, "https:"),
              units: 64,
          }
        : null
}

export async function fetchOptifineCape() {
    const res = await fetch(optifineCapeUrl, options())
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`OptiFine responded ${res.status}`)
    return res.arrayBuffer()
}

async function getOptifineCape(): Promise<Cape | null> {
    const image = await fetchOptifineCape()
    if (!image) return null

    const width = new DataView(image).getUint32(16)

    return {
        provider: "OptiFine",
        // OptiFine only serves capes over plain HTTP, so they go through our own route
        url: "/assets/capes/optifine",
        units: width % 64 === 0 ? 64 : 46,
    }
}

async function getMinecraftCapesCape(): Promise<Cape | null> {
    const profile = await getJson(
        `https://api.minecraftcapes.net/profile/${mcUuid}`,
    )
    const url = record(profile) ? string(profile.cape_url) : null

    return url ? { provider: "MinecraftCapes", url, units: 64 } : null
}

export async function getCapes(): Promise<Cape[]> {
    const results = await Promise.allSettled([
        getMinecraftCape(),
        getOptifineCape(),
        getMinecraftCapesCape(),
    ])

    return results.flatMap((result) => {
        if (result.status === "fulfilled") return result.value ?? []

        console.error("Error fetching cape:", result.reason)
        return []
    })
}
