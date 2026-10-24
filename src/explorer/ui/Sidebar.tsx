import { ArrowRight, Files, ListTree, Search } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { fieldClass } from "@/components/Tools/fields"
import { useExplorerStore } from "../store"
import ModuleDetails from "./ModuleDetails"
import ModuleSearch from "./ModuleSearch"
import { useAsync, errorMessage } from "./useAsync"
import VirtualList from "./VirtualList"

const tabs = [
    { id: "modules", label: "Modules", icon: Files },
    { id: "search", label: "Search", icon: Search },
    { id: "details", label: "Details", icon: ListTree },
] as const

type Tab = (typeof tabs)[number]["id"]

export default function Sidebar() {
    const [tab, setTab] = useState<Tab>("modules")

    return (
        <aside className="flex w-80 shrink-0 flex-col border-r border-zinc-300 max-md:absolute max-md:inset-0 max-md:z-10 max-md:w-full max-md:border-r-0 max-md:bg-zinc-100 dark:border-zinc-800 max-md:dark:bg-zinc-950">
            <div className="px-3 py-3">
                <div
                    role="tablist"
                    className="flex w-full rounded-xl bg-zinc-200 p-1 dark:bg-zinc-800"
                >
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            role="tab"
                            type="button"
                            aria-selected={tab === id}
                            onClick={() => setTab(id)}
                            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                                tab === id
                                    ? "bg-zinc-100 text-neutral-900 shadow-sm dark:bg-zinc-700 dark:text-neutral-100"
                                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                            }`}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex min-h-0 grow flex-col">
                <div hidden={tab !== "modules"} className="contents">
                    <ModuleList />
                </div>
                <div hidden={tab !== "search"} className="contents">
                    <ModuleSearch />
                </div>
                <div hidden={tab !== "details"} className="contents">
                    <ModuleDetails />
                </div>
            </div>
        </aside>
    )
}

function ModuleList() {
    const bundleApi = useExplorerStore((s) => s.bundleApi)
    const selectedModule = useExplorerStore((s) => s.selectedModule)
    const [input, setInput] = useState("")
    const [error, setError] = useState<string | null>(null)
    const loadModuleIds = useCallback(
        () => bundleApi!.getModuleIds(),
        [bundleApi],
    )
    const moduleIds = useAsync(bundleApi ? loadModuleIds : null)
    const selectedIndex = useMemo(
        () =>
            moduleIds.status === "success" && selectedModule != null
                ? moduleIds.data.indexOf(selectedModule)
                : null,
        [moduleIds, selectedModule],
    )

    async function jumpToModule() {
        const moduleId = Number(input.trim())
        if (!input.trim() || !Number.isInteger(moduleId) || !bundleApi) return

        if (await bundleApi.hasModule(moduleId)) {
            setError(null)
            useExplorerStore.getState().navigate(moduleId)
        } else {
            setError(`No module with ID ${moduleId}`)
        }
    }

    return (
        <>
            <form
                className="flex gap-2 px-3 pb-2"
                onSubmit={(event) => {
                    event.preventDefault()
                    void jumpToModule()
                }}
            >
                <input
                    value={input}
                    onChange={(event) => {
                        setInput(event.target.value)
                        setError(null)
                    }}
                    inputMode="numeric"
                    placeholder="Module ID"
                    aria-label="Module ID"
                    aria-invalid={error ? true : undefined}
                    className={fieldClass}
                />
                <button
                    type="submit"
                    aria-label="Jump to module"
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 text-neutral-600 transition-colors hover:bg-zinc-200 hover:text-rose-500 active:scale-[.97] dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 dark:hover:bg-zinc-800"
                >
                    <ArrowRight size={16} />
                </button>
            </form>
            {error && (
                <p className="px-3 pb-2 text-sm text-rose-500">{error}</p>
            )}
            {moduleIds.status === "pending" && (
                <p className="px-3 text-sm text-neutral-500 dark:text-neutral-400">
                    Loading modules…
                </p>
            )}
            {moduleIds.status === "error" && (
                <p className="px-3 text-sm text-rose-500">
                    Failed to load the module list:{" "}
                    {errorMessage(moduleIds.error)}
                </p>
            )}
            {moduleIds.status === "success" && (
                <VirtualList
                    className="grow"
                    count={moduleIds.data.length}
                    rowHeight={28}
                    scrollToIndex={selectedIndex}
                    renderRow={(index) => {
                        const moduleId = moduleIds.data[index]
                        const selected = moduleId === selectedModule

                        return (
                            <button
                                type="button"
                                onClick={() =>
                                    useExplorerStore
                                        .getState()
                                        .navigate(moduleId)
                                }
                                aria-current={selected ? "true" : undefined}
                                className={`h-full w-full cursor-pointer px-3 text-left font-mono text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                                    selected
                                        ? "text-rose-600 dark:text-rose-400"
                                        : "text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                {moduleId}
                            </button>
                        )
                    }}
                />
            )}
        </>
    )
}
