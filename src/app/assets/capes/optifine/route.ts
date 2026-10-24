import { fetchOptifineCape } from "@/lib/capes"

export async function GET() {
    try {
        const image = await fetchOptifineCape()
        if (!image) {
            return new Response("No OptiFine cape", { status: 404 })
        }

        return new Response(image, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=3600",
            },
        })
    } catch {
        return new Response("Failed to load cape", { status: 502 })
    }
}
