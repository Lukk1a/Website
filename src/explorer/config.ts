export const SERVER_BASE_URL = "https://tracker.thororen.com"
export const TRACKER_REPO_URL =
    "https://github.com/thororen1234/Discord-Bundle-Downloader"
export const UPSTREAM_REPO_URL = "https://github.com/sadan4/sadan.zip"
export const UPSTREAM_ISSUE_URL = `${UPSTREAM_REPO_URL}/issues/new`
export const SITE_REPO_URL = "https://github.com/Lukk1a/Website"

export const bundleArchiveUrl = (buildHash: string) =>
    `${SERVER_BASE_URL}/build/archive/${buildHash}.7z`
