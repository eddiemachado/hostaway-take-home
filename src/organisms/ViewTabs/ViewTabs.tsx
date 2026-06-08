import { useState } from "react";
import { DialogTrigger, Popover, Dialog, type Key } from "react-aria-components";
import { Plus, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Tabs } from "@/components/application/tabs/tabs";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

export interface SystemTab {
    id: string;
    label: string;
}

export interface SavedViewTab {
    id: string;
    label: string;
}

export interface ViewTabsProps {
    /** System status scopes (e.g. All, Upcoming). Selecting one keeps the filter layer in place. */
    systemTabs: SystemTab[];
    /** User-saved filter presets, shown after a divider. Opening one restores its filters. */
    savedViews: SavedViewTab[];
    /** The single highlighted tab — a system-tab id OR a saved-view id. */
    activeKey: string;
    onSelectSystemTab: (id: string) => void;
    onOpenSavedView: (id: string) => void;
    onSaveView: (name: string) => void;
    onDeleteView: (id: string) => void;
    /** Whether the current filter layer can be saved as a new view. */
    canSave: boolean;
}

/**
 * View switcher (plan.md §2c). Two dimensions sit in one strip: system status tabs (a scope that
 * preserves your filters) and user-saved views (named filter presets). A divider separates them;
 * the trailing control saves the current filters as a new view and manages existing ones.
 */
export const ViewTabs = ({ systemTabs, savedViews, activeKey, onSelectSystemTab, onOpenSavedView, onSaveView, onDeleteView, canSave }: ViewTabsProps) => {
    // System tabs and saved views share ONE Tabs collection, so React Aria guarantees exactly one
    // selected tab (no double-highlight). We branch on selection: saved-view ids open a view; the
    // rest select a status scope.
    const savedIds = new Set(savedViews.map((v) => v.id));
    const onSelect = (k: Key) => {
        const id = String(k);
        if (savedIds.has(id)) onOpenSavedView(id);
        else onSelectSystemTab(id);
    };

    return (
        <div className="flex items-end justify-between gap-4 border-b border-secondary">
            <div className="flex items-end gap-3">
                <Tabs selectedKey={activeKey} onSelectionChange={onSelect}>
                    <Tabs.List type="underline" aria-label="Reservation views" className="before:hidden">
                        {systemTabs.map((t) => (
                            <Tabs.Item key={t.id} id={t.id} label={t.label} />
                        ))}
                        {savedViews.map((v, i) => (
                            <Tabs.Item
                                key={v.id}
                                id={v.id}
                                label={v.label}
                                // Double the gap before the first saved view, with the divider centered in it.
                                className={cx(i === 0 && "relative ml-3 before:absolute before:-left-3 before:top-1/2 before:h-5 before:w-px before:-translate-y-1/2 before:bg-border-secondary")}
                            />
                        ))}
                    </Tabs.List>
                </Tabs>

                <SaveViewControl savedViews={savedViews} canSave={canSave} onSave={onSaveView} onDelete={onDeleteView} />
            </div>
        </div>
    );
};

interface SaveViewControlProps {
    savedViews: SavedViewTab[];
    canSave: boolean;
    onSave: (name: string) => void;
    onDelete: (id: string) => void;
}

const SaveViewControl = ({ savedViews, canSave, onSave, onDelete }: SaveViewControlProps) => {
    const [name, setName] = useState("");

    const handleSave = (close: () => void) => {
        if (!name.trim() || !canSave) return;
        onSave(name);
        setName("");
        close();
    };

    return (
        <DialogTrigger>
            <Tooltip title="Save view" placement="top">
                <TooltipTrigger
                    aria-label="Save view"
                    className={cx(
                        // +2px bottom padding over the tabs' pb-2.5 to optically align the icon with the tab text baseline.
                        "flex shrink-0 cursor-pointer items-center rounded-none px-0.5 pb-3 text-quaternary transition duration-100 ease-linear",
                        "outline-focus-ring hover:text-secondary focus-visible:outline-2 focus-visible:-outline-offset-2",
                    )}
                >
                    <Plus className="size-5" />
                </TooltipTrigger>
            </Tooltip>
            <Popover
                placement="bottom end"
                className={cx(
                    "w-72 rounded-xl border border-secondary bg-primary p-1.5 shadow-lg outline-none",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0",
                )}
            >
                <Dialog className="flex flex-col gap-1 outline-none" aria-label="Save or manage views">
                    {({ close }) => (
                        <>
                            <div className="flex flex-col gap-2 p-1.5">
                                <Input
                                    size="sm"
                                    placeholder="Save current filters as…"
                                    aria-label="New view name"
                                    value={name}
                                    onChange={(v) => setName(v)}
                                    isDisabled={!canSave}
                                />
                                <Button color="secondary" size="sm" isDisabled={!name.trim() || !canSave} onPress={() => handleSave(close)}>
                                    {canSave ? "Save view" : "Set filters to save"}
                                </Button>
                            </div>

                            {savedViews.length > 0 && (
                                <>
                                    <div className="my-1 h-px bg-border-secondary" />
                                    <p className="px-2.5 pt-1 pb-0.5 text-xs font-semibold tracking-wide text-quaternary uppercase">Saved views</p>
                                    <ul className="flex flex-col">
                                        {savedViews.map((view) => (
                                            <li key={view.id} className="group flex items-center justify-between gap-1 rounded-md px-2.5 py-1.5 hover:bg-secondary_hover">
                                                <span className="truncate text-sm text-secondary">{view.label}</span>
                                                <Button
                                                    iconLeading={Trash01}
                                                    color="tertiary"
                                                    size="sm"
                                                    aria-label={`Delete view ${view.label}`}
                                                    onPress={() => onDelete(view.id)}
                                                    className="opacity-0 group-hover:opacity-100"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </>
                    )}
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
};
