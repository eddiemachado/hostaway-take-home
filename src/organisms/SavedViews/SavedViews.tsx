import { useState } from "react";
import { DialogTrigger, Popover, Dialog } from "react-aria-components";
import { Bookmark, ChevronDown, Trash01 } from "@untitledui/icons";
import { Button } from "@/atoms/Button";
import { IconButton } from "@/atoms/IconButton";
import { Input } from "@/atoms/Input";
import { Divider } from "@/atoms/Divider";
import { cx } from "@/utils/cx";
import type { SavedView } from "@/lib/savedViews";

export interface SavedViewsProps {
    views: SavedView[];
    onApply: (view: SavedView) => void;
    onDelete: (id: string) => void;
    /** Save the *current* filters under a name. */
    onSave: (name: string) => void;
    /** Whether there are current filters worth saving. */
    canSave: boolean;
}

/** Saved-views dropdown: apply / delete saved filter sets, and save the current set. */
export const SavedViews = ({ views, onApply, onDelete, onSave, canSave }: SavedViewsProps) => {
    const [name, setName] = useState("");

    const handleSave = (close: () => void) => {
        if (!name.trim() || !canSave) return;
        onSave(name);
        setName("");
        close();
    };

    return (
        <DialogTrigger>
            <Button variant="secondary" size="sm" iconLeading={Bookmark} iconTrailing={ChevronDown}>
                Views{views.length > 0 ? ` (${views.length})` : ""}
            </Button>
            <Popover
                placement="bottom start"
                className={cx(
                    "w-72 rounded-xl border border-secondary bg-primary p-1.5 shadow-lg outline-none",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0",
                )}
            >
                <Dialog className="flex flex-col gap-1 outline-none" aria-label="Saved views">
                    {({ close }) => (
                        <>
                            {views.length === 0 ? (
                                <p className="px-2.5 py-3 text-sm text-tertiary">No saved views yet.</p>
                            ) : (
                                <ul className="flex flex-col">
                                    {views.map((view) => (
                                        <li key={view.id} className="group flex items-center gap-1 rounded-md hover:bg-secondary_hover">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onApply(view);
                                                    close();
                                                }}
                                                className="flex-1 cursor-pointer rounded-md px-2.5 py-2 text-left text-sm text-secondary outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                                            >
                                                {view.name}
                                                <span className="ml-2 text-xs text-quaternary">
                                                    {view.filters.length} filter{view.filters.length === 1 ? "" : "s"}
                                                </span>
                                            </button>
                                            <IconButton
                                                icon={Trash01}
                                                variant="tertiary"
                                                size="sm"
                                                aria-label={`Delete view ${view.name}`}
                                                onPress={() => onDelete(view.id)}
                                                className="opacity-0 group-hover:opacity-100"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Divider className="my-1" />

                            <div className="flex flex-col gap-2 p-1.5">
                                <Input
                                    inputSize="sm"
                                    placeholder="Save current filters as…"
                                    aria-label="New view name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSave(close)}
                                />
                                <Button variant="secondary" size="sm" isDisabled={!name.trim() || !canSave} onPress={() => handleSave(close)}>
                                    {canSave ? "Save view" : "Add filters to save"}
                                </Button>
                            </div>
                        </>
                    )}
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
};
