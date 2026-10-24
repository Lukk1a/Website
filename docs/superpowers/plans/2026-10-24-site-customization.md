# Lukka.dev Site Customization & Vercel Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully customize the portfolio site for Lukka (Luka Pajkanovic) at `https://lukka.dev`, hook up live integrations (Lanyard Discord, Steam, Minecraft, Last.fm, GitHub), prune legacy routes, and verify it builds cleanly for Vercel deployment.

**Architecture:** Centralize all identity and service parameters in `src/consts.ts`, update layout components (`Header`, `Hero`, `Footer`) to consume these constants instead of hardcoded strings, replace previous projects with Lukka's real software repositories, prune obsolete legacy pages (`/beycord`, `/misc/meshos`, and MyAnimeList), and verify full Next.js static build compliance.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Vercel CLI.

**Spec:** `docs/superpowers/specs/2026-10-24-site-customization-design.md`

## Global Constraints
- Do not introduce breaking schema changes to types consumed by remaining pages.
- Ensure `next build` passes with zero TypeScript or linting errors.
- Ensure all legacy `thororen` text and links are replaced.
- Ensure `friendsList` handles empty state without breaking UI rendering.
- Vercel deployment target: `https://lukka.dev`.

## Review Focus
1. **Empty friends list**: `src/components/Profile/Friends.tsx` rendering when `friendsList` is empty — must not crash or display ugly empty boxes.
2. **Missing MyAnimeList references**: Removing MAL must not leave orphaned imports in `src/app/(site)/now/page.tsx` or dangling API routes.
3. **Steam custom URL vs SteamID64**: Custom URL `o_Lukka` must properly route via `src/lib/steam.ts` to `https://steamcommunity.com/id/o_Lukka/?xml=1`.
4. **Lanyard live presence**: User ID `998585779804708864` must supply avatar and status with zero console errors.
5. **Next.js Webpack Workers for Monaco**: Build must compile cleanly under Next.js 16 without build worker resolution errors.

---

### Task 1: Update Central Configuration (`src/consts.ts`)

**Files:**
- Modify: `src/consts.ts`

**Interfaces:**
- Consumes: `NavLink`, `Social`, `Project`, `MiscPage`, `Info` from `src/types.ts`
- Produces: `displayName`, `fullName`, `siteUrl`, `discordUserId`, `githubUser`, `steamId`, `mcUsername`, `mcUuid`, `lastfmUser`, updated `bio`, `information`, `socials`, `projects`, `miscPages`, `friends`

- [ ] **Step 1: Update constants with Lukka's identity and accounts**

Update `src/consts.ts`:
- Export `displayName = "Lukka"`
- Export `fullName = "Luka Pajkanovic"`
- Set `siteUrl = "https://lukka.dev"`
- Set `discordUserId = "998585779804708864"`
- Set `githubUser = "Lukk1a"`
- Set `steamId = "o_Lukka"`
- Set `mcUsername = "Lukk1a"`
- Set `mcUuid = "f7706a5939b14b9db4f9b11e03c7f5ea"`
- Set `lastfmUser = "Lukka1232"`
- Remove `malUsername`
- Set `bio` to: `"Hi! I'm Lukka! I'm a systems and web developer focused on low-latency native systems and modern web platforms."`
- Update `information` to Location "Serbia" and Pronouns "He/Him".
- Update `socials` with GitHub (`https://github.com/Lukk1a`), Steam (`https://steamcommunity.com/id/o_Lukka/`), Discord (`https://discord.com/users/998585779804708864`), Last.fm (`https://www.last.fm/user/Lukka1232`).
- Set `friendsList = []`.
- Prune `miscPages`: remove MeshOS and Beycord.
- Replace `projects` with:
  1. `OculusMC`
  2. `activeScreen.desktop`
  3. `portfolio-website`
  4. `sys-mcp`

- [ ] **Step 2: Verify `src/consts.ts` syntax and exports**

Run: `pnpm exec tsc --noEmit`
Expected: Only type errors in downstream files that still reference `malUsername` (to be cleaned in Task 3).

- [ ] **Step 3: Commit**

```bash
git add src/consts.ts
git commit -m "feat: customize central configuration in consts.ts for Lukka"
```

---

### Task 2: Parameterize Layout and Profile Components

**Files:**
- Modify: `src/components/Layout/Header.tsx`
- Modify: `src/components/Layout/Footer.tsx`
- Modify: `src/components/Profile/Hero.tsx`
- Modify: `src/components/Profile/Socials.tsx`
- Modify: `src/components/Profile/Friends.tsx`

**Interfaces:**
- Consumes: `displayName`, `fullName`, `bio`, `information` from `@/consts`

- [ ] **Step 1: Refactor `Header.tsx`**

Replace hardcoded `<span>thororen</span>` with `displayName` imported from `@/consts`.

- [ ] **Step 2: Refactor `Hero.tsx`**

Replace hardcoded `<h1>thororen</h1>` with `displayName` imported from `@/consts`.

- [ ] **Step 3: Refactor `Footer.tsx`**

Replace `© {new Date().getFullYear()} thororen` and `"Made with 💗 from thororen and Naibuu"` with clean attribution to `Lukka`.

- [ ] **Step 4: Update `Socials.tsx`**

Remove hardcoded `https://github.com/sponsors/thororen1234` donation button or update to Lukka's profile link.

- [ ] **Step 5: Gracefully handle empty friends list in `Friends.tsx`**

If `friends.length === 0`, display a friendly empty state ("No friends listed yet.") instead of broken layout.

- [ ] **Step 6: Verify component changes**

Run: `pnpm exec tsc --noEmit`
Expected: Components compile without type errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Layout/Header.tsx src/components/Layout/Footer.tsx src/components/Profile/Hero.tsx src/components/Profile/Socials.tsx src/components/Profile/Friends.tsx
git commit -m "feat: parameterize layout components with dynamic displayName and author info"
```

---

### Task 3: Clean Up `/now` Page and Remove MyAnimeList

**Files:**
- Modify: `src/app/(site)/now/page.tsx`
- Remove: `src/components/Widgets/WatchingSection.tsx` (or make it no-op/delete)
- Remove: `src/lib/mal.ts` and `src/lib/mal-parse.ts` (if orphaned)

**Interfaces:**
- Consumes: `steamId`, `mcUsername`, `lastfmUser`, `githubUser` from `@/consts`

- [ ] **Step 1: Remove `WatchingSection` from `src/app/(site)/now/page.tsx`**

Remove the import of `WatchingSection` and its JSX element from the layout.

- [ ] **Step 2: Delete orphaned MAL files**

Delete `src/components/Widgets/WatchingSection.tsx`, `src/lib/mal.ts`, and `src/lib/mal-parse.ts`.

- [ ] **Step 3: Verify `/now` page compiles**

Run: `pnpm exec tsc --noEmit`
Expected: PASS with 0 MAL-related errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(site)/now/page.tsx
git rm src/components/Widgets/WatchingSection.tsx src/lib/mal.ts src/lib/mal-parse.ts
git commit -m "refactor: remove MyAnimeList watching section from now page"
```

---

### Task 4: Remove Legacy Routes (`/beycord` and `/misc/meshos`)

**Files:**
- Delete directory: `src/app/beycord`
- Delete directory: `src/app/(site)/misc/meshos`
- Modify: `src/app/sitemap.ts` (remove legacy route references if listed)

- [ ] **Step 1: Delete legacy route directories**

Remove `src/app/beycord` and `src/app/(site)/misc/meshos`.

- [ ] **Step 2: Check `sitemap.ts` and `robots.ts`**

Ensure `sitemap.ts` only generates URLs for existing pages (`/`, `/projects`, `/now`, `/discord/*`, `/misc/dev-tools`, `/misc/minecraft-formatting`).

- [ ] **Step 3: Update `src/explorer/config.ts`**

Update repo URL from `https://github.com/thororen1234/Website` to `https://github.com/Lukk1a/Website`.

- [ ] **Step 4: Commit**

```bash
git rm -r src/app/beycord src/app/\(site\)/misc/meshos
git add src/app/sitemap.ts src/explorer/config.ts
git commit -m "refactor: remove legacy beycord and meshos routes"
```

---

### Task 5: Update Metadata, Discord Embeds, Package Config, and Docker

**Files:**
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/app/(site)/projects/[slug]/page.tsx`
- Modify: `src/app/(site)/projects/[slug]/og.png/route.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/lib/embed.ts`
- Modify: `src/lib/github.ts`
- Modify: `src/lib/repos.ts`
- Modify: `package.json`
- Modify: `docker-compose.yml`

- [ ] **Step 1: Update page metadata & OpenGraph route**

In `src/app/(site)/page.tsx`, `projects/[slug]/page.tsx`, and `not-found.tsx`, replace `thororen` metadata titles with `Lukka` or `${displayName}`.
In `projects/[slug]/og.png/route.tsx`, replace `thororen.com` with `lukka.dev`.

- [ ] **Step 2: Update Discord embed payload**

In `src/lib/embed.ts`, replace `thororen` with `Lukka` and update the summary.

- [ ] **Step 3: Update User-Agent headers**

In `src/lib/github.ts` and `src/lib/repos.ts`, change `"User-Agent": "thororen-website"` to `"User-Agent": "lukka-website"`.

- [ ] **Step 4: Update `package.json` & `docker-compose.yml`**

In `package.json`, update author to `"Luka Pajkanovic <pajkanovicluka7@gmail.com>"`.
In `docker-compose.yml`, update image to `ghcr.io/lukk1a/website:latest`.

- [ ] **Step 5: Verify no remaining `thororen` references**

Run: `git grep -i "thororen"`
Expected: No matches in application source code.

- [ ] **Step 6: Commit**

```bash
git add src/app/ src/lib/ package.json docker-compose.yml
git commit -m "chore: update metadata, Discord embeds, author and docker configs"
```

---

### Task 6: Verify Build & Prepare Vercel Deployment

**Files:**
- Test: Full Next.js production build (`pnpm build`)

- [ ] **Step 1: Run TypeScript typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 2: Run Next.js production build**

Run: `pnpm run build`
Expected: Build successfully compiles all routes and static assets.

- [ ] **Step 3: Verify local output**

Ensure `.next` is generated with valid page manifests.

- [ ] **Step 4: Prepare Vercel Deployment**

Provide the exact Vercel deployment command or initiate deployment using `vercel --prod` if the user is authenticated.

- [ ] **Step 5: Commit any final build fixes**

```bash
git add .
git commit -m "chore: finalize build verification for Vercel deployment"
```
