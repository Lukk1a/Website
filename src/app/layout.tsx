import "@/styles/global.css"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { siteUrl } from "@/consts"

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    icons: { icon: { url: "/assets/favicon.png", type: "image/png" } },
}

export const viewport: Viewport = {
    themeColor: "#970000ff",
}

const themeScript = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';localStorage.setItem('theme',t)}document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
                <link
                    rel="preload"
                    href="/assets/fonts/InterVariable.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </head>
            <body>
                {children}
                <SpeedInsights />

                <div style={{ display: "none" }}>
                    <a
                        href="https://www.abuseipdb.com/user/201906"
                        title="AbuseIPDB is an IP address blacklist for webmasters and sysadmins to report IP addresses engaging in abusive behavior on their networks"
                    >
                        <img
                            src="https://www.abuseipdb.com/contributor/201906.svg"
                            alt="AbuseIPDB Contributor Badge"
                            style={{ width: 401 }}
                        />
                    </a>
                </div>
            </body>
        </html>
    )
}
