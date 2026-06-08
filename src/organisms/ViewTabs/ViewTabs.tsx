import { useState } from "react";
import { DialogTrigger, Popover, Dialog, type Key } from "react-aria-components";
import { Plus, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Tabs } from "@/components/application/tabs/tabs";
import { cx } from "@/utils/cx";

export interface ViewTab {
    id: string;
    label: string;
    count: number;
    /** System presets (e.g. "Upcoming") can't be deleted; user-saved views can. */
    system?: boolean;
}

export interface ViewTabsProps {
    /** System presets first, then user-saved views — all rendered as tabs. */
    views: ViewTab[];
    /** Active view id, or null when the current filters don't match any view (custom). */
    activeId: string | null;
    /** Row count for the transient "Custom" tab (shown only while activeId is null). */
    customCount: number;
    onSelect: (id: string) => void;
    onSaveView: (name: string) => void;
    onDeleteView: (id: string) => void;
    /** Whether the current (custom, non-empty) filters can be saved as a new view. */
    canSave: boolean;
}

const CUSTOM_ID = "__custom__";

/**
 * Unified view switcher (plan.md §2c). System presets and user-saved views are one model — a named
 * snapshot of filters with a count — so they live in one tab strip. The trailing control saves the
 * current filters as a new view and manages (deletes) existing ones.
 */
export const ViewTabs = ({ views, activeId, customCount, onSelect, onSaveView, onDeleteView, canSave }: ViewTabsProps) => {
    const userViews = views.filter((v) => !v.system);
    const items: ViewTab[] = activeId === null ? [...views, { id: CUSTOM_ID, label: "Custom", count: customCount, system: true }] : views;

    return (
        <div className="flex items-end justify-between gap-4 border-b border-secondary">
            <Tabs
                selectedKey={activeId ?? CUSTOM_ID}
                onSelectionChange={(k: Key) => {
                    const id = String(k);
                    if (id !== CUSTOM_ID) onSelect(id);
                }}
            >
                <Tabs.List type="underline" aria-label="Reservation views" className="before:hidden">
                    {items.map((v) => (
                        <Tabs.Item key={v.id} id={v.id} label={v.label} badge={v.count} />
                    ))}
                </Tabs.List>
            </Tabs>

            <SaveViewControl userViews={userViews} canSave={canSave} onSave={onSaveView} onDelete={onDeleteView} />
        </div>
    );
};

interface SaveViewControlProps {
    userViews: ViewTab[];
    canSave: boolean;
    onSave: (name: string) => void;
    onDelete: (id: string) => void;
}

const SaveViewControl = ({ userViews, canSave, onSave, onDelete }: SaveViewControlProps) => {
    const [name, setName] = useState("");

    const handleSave = (close: () => void) => {
        if (!name.trim() || !canSave) return;
        onSave(name);
        setName("");
        close();
    };

    return (
        <DialogTrigger>
            <Button color="tertiary" size="sm" iconLeading={Plus} className="mb-1.5 shrink-0">
                Save view
            </Button>
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
                                    {canSave ? "Save view" : "Adjust filters to save"}
                                </Button>
                            </div>

                            {userViews.length > 0 && (
                                <>
                                    <div className="my-1 h-px bg-border-secondary" />
                                    <p className="px-2.5 pt-1 pb-0.5 text-xs font-semibold tracking-wide text-quaternary uppercase">Saved views</p>
                                    <ul className="flex flex-col">
                                        {userViews.map((view) => (
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
