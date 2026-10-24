# Lukka.dev Portfolio Customization & Refactoring Specification

## 1. Overview
This specification details the end-to-end personalization and refactoring of the portfolio website for **Lukka (Luka Pajkanovic)** at [https://lukka.dev](https://lukka.dev). The codebase is a Next.js 16 + React 19 + Tailwind CSS application originally configured for a previous author. This specification covers centralizing configuration, binding verified live data sources, establishing Lukka's project showcase, and pruning legacy/niche modules.

---

## 2. Goals & Success Criteria

### Goals
1. **Identity & Centralization**: Replace all hardcoded references to previous owners (`thororen`, `thororen1234`, `Alex Naibuu`) with dynamic references to `displayName` ("Lukka"), `fullName` ("Luka Pajkanovic"), and `siteUrl` ("https://lukka.dev") defined centrally in `src/consts.ts`.
2. **Verified Live Services**:
   - **Discord Presence**: Connect to Lanyard with Discord User ID `998585779804708864` (`l1uka1` / Luka) for live avatar, custom status, and nameplates.
   - **Steam Activity**: Bind Steam custom URL `o_Lukka` (SteamID64 `76561199353205851`).
   - **Minecraft Presence**: Bind Minecraft Java username `Lukk1a` with UUID `f7706a5939b14b9db4f9b11e03c7f5ea`.
   - **Music Scrobbling**: Bind Last.fm user `Lukka1232`.
   - **Developer Commits**: Bind GitHub activity stream to `Lukk1a`.
3. **Curated Project Showcase**: Replace previous projects with Lukka's active and flagship software systems:
   - `OculusMC`
   - `activeScreen.desktop`
   - `portfolio-website`
   - `sys-mcp`
4. **Legacy Cleanup**:
   - Remove MyAnimeList (`WatchingSection`) completely.
   - Remove `/beycord` route and memorial page.
   - Remove `/misc/meshos` keygen and firmware route.
   - Reset `friendsList` to an empty list `[]` while preserving clean rendering.
   - Remove hardcoded tracker endpoint (`tracker.thororen.com`) and sponsors link (`sponsors/thororen1234`).
   - Update `package.json`, `docker-compose.yml`, and metadata.

### Success Criteria
- Running `pnpm build` or `next build` succeeds with zero TypeScript or build errors.
- Header, Hero, Footer, and page metadata render "Lukka" with no mentions of "thororen".
- Live widgets fetch from Lanyard (`998585779804708864`), Steam (`o_Lukka`), Last.fm (`Lukka1232`), and GitHub (`Lukk1a`).
- No broken links or 404 references to removed legacy pages.

---

## 3. Architecture & Changes

### 3.1. Central Configuration (`src/consts.ts`)
- Export `displayName = "Lukka"` and `fullName = "Luka Pajkanovic"`.
- Set `siteUrl = "https://lukka.dev"`.
- Set `discordUserId = "998585779804708864"`.
- Set `githubUser = "Lukk1a"`.
- Set `steamId = "o_Lukka"`.
- Set `mcUsername = "Lukk1a"`.
- Set `mcUuid = "f7706a5939b14b9db4f9b11e03c7f5ea"`.
- Set `lastfmUser = "Lukka1232"`.
- Remove `malUsername`.
- Update `bio`:
  `"Hi! I'm Lukka! I'm a systems and web developer focused on low-latency native systems and modern web platforms."`
- Update `information`:
  - Location: `Serbia` (MapPin)
  - Pronouns: `He/Him` (User)
- Update `socials`:
  - GitHub: `https://github.com/Lukk1a`
  - Steam: `https://steamcommunity.com/id/o_Lukka/`
  - Discord: `https://discord.com/users/998585779804708864`
  - Last.fm: `https://www.last.fm/user/Lukka1232`
- Update `miscPages`:
  - Retain `Developer Tools` (`/misc/dev-tools`)
  - Retain `Minecraft Formatting` (`/misc/minecraft-formatting`)
  - Remove `MeshOS Keygen`
  - Remove `Beycord`
- Update `projects`:
  1. **OculusMC**:
     - `slug`: `"oculusmc"`
     - `title`: `"OculusMC"`
     - `description`: `"Precision Minecraft server dashboard — PaperMC plugin with Javalin API, React+Vite frontend, live Anvil map, and Plan analytics."`
     - `github`: `"https://github.com/Lukk1a/OculusMC"`
     - `tags`: `["Java", "PaperMC", "React", "Vite", "TypeScript"]`
     - `tasks`: `["Full-stack dashboard development", "PaperMC plugin & Javalin API engineering", "Interactive live Anvil map renderer"]`
     - `start`: 2026
  2. **activeScreen.desktop**:
     - `slug`: `"activescreen-desktop"`
     - `title`: `"activeScreen.desktop"`
     - `description`: `"Desktop activity and monitor utility with high-efficiency screen capture and local telemetry."`
     - `github`: `"https://github.com/Lukk1a/activeScreen.desktop"`
     - `tags`: `["TypeScript", "Desktop", "Node.js"]`
     - `tasks`: `["Desktop architecture and integration", "Low-overhead telemetry capture"]`
     - `start`: 2026
  3. **portfolio-website**:
     - `slug`: `"portfolio-website"`
     - `title`: `"portfolio-website"`
     - `description`: `"Personal engineering portfolio engineered for high runtime performance, WCAG 2.2 AA accessibility, and automated multi-stage CI/CD container delivery."`
     - `github`: `"https://github.com/Lukk1a/portfolio-website"`
     - `tags`: `["Next.js", "React", "TypeScript", "Tailwind CSS", "Docker"]`
     - `tasks`: `["Design system and UI performance", "Accessibility auditing", "CI/CD containerization pipeline"]`
     - `start`: 2026
  4. **sys-mcp**:
     - `slug`: `"sys-mcp"`
     - `title`: `"sys-mcp"`
     - `description`: `"High-performance Model Context Protocol (MCP) server for systems diagnostics, metrics, and contextual environment feeds."`
     - `github`: `"https://github.com/Lukk1a/sys-mcp"`
     - `tags`: `["TypeScript", "MCP", "Systems", "Node.js"]`
     - `tasks`: `["MCP tool interface implementation", "System metrics integration"]`
     - `start`: 2026
- Set `friendsList = []`.

### 3.2. Layout Components
- **`src/components/Layout/Header.tsx`**: Replace hardcoded `<span>thororen</span>` with `displayName` from `@/consts`.
- **`src/components/Layout/Footer.tsx`**: Update copyright and attribution to `displayName` and clean author credits.
- **`src/components/Profile/Hero.tsx`**: Replace hardcoded `<h1>thororen</h1>` with `displayName` from `@/consts`.
- **`src/components/Profile/Socials.tsx`**: Remove hardcoded sponsor link pointing to `thororen1234`.
- **`src/components/Profile/Friends.tsx`**: Guard empty `friends` list gracefully so the section handles zero friends cleanly.

### 3.3. Now Page & Services (`src/app/(site)/now/page.tsx`)
- Remove `WatchingSection` (MyAnimeList).
- Clean up unused imports and references to MAL.
- Verify `SteamSection`, `MinecraftSection`, `ListeningSection` (Last.fm), `CodingSection`, and `ActivityFeed` render without errors.

### 3.4. Deletion of Legacy Routes
- Delete `src/app/beycord` directory.
- Delete `src/app/(site)/misc/meshos` directory.
- Clean up any dead links or references in navigation/sitemap.

### 3.5. Metadata, Embeds & Explorer Configuration
- **`src/app/(site)/page.tsx`**: Update metadata title to `Lukka` and description to Lukka's bio.
- **`src/app/(site)/projects/[slug]/page.tsx`**: Update title template from `${project.title} | thororen` to `${project.title} | Lukka`.
- **`src/app/not-found.tsx`**: Update title to `Lukka`.
- **`src/lib/embed.ts`**: Update Discord rich embed text to `Lukka` and bio.
- **`src/lib/github.ts` & `src/lib/repos.ts`**: Update `User-Agent` to `lukka-website`.
- **`src/explorer/config.ts`**: Update repo URL to `https://github.com/Lukk1a/Website`.
- **`package.json`**: Update author to `"Luka Pajkanovic <pajkanovicluka7@gmail.com>"`.
- **`docker-compose.yml`**: Update container image name to `ghcr.io/lukk1a/website:latest`.

---

## 4. Verification & Testing Plan

1. **Static Analysis & Typecheck**:
   - Run TypeScript compiler: `pnpm exec tsc --noEmit` or `next build` to verify all imports, types, and route references pass.
2. **Text Search Verification**:
   - Run `git grep -i "thororen"` across the entire project to ensure 0 remaining occurrences.
3. **Runtime & Page Route Verification**:
   - Verify `/` (Home) renders Header ("Lukka"), Hero ("Lukka"), Live widgets, Projects (OculusMC, activeScreen.desktop, etc.), and Footer.
   - Verify `/now` loads live data from Steam (`o_Lukka`), Last.fm (`Lukka1232`), Minecraft (`Lukk1a`), and GitHub commits without MAL error.
   - Verify `/projects` lists the 4 new projects with working GitHub links.
   - Verify `/misc` displays Developer Tools and Minecraft Formatting without dead links.
   - Verify `/beycord` and `/misc/meshos` return 404 or are cleanly removed.
