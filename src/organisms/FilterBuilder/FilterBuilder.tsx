import { useEffect, useState, type ReactElement } from "react";
import { DialogTrigger, Popover, Dialog } from "react-aria-components";
import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { FilterControl } from "@/molecules/FilterControl";
import { cx } from "@/utils/cx";
import { emptyValue, isEmpty, type AppliedFilter, type FieldDef, type FilterValue } from "@/lib/filtering";

export interface FilterBuilderProps {
    /** Focusable React Aria trigger (e.g. an "Add filter" Button). */
    trigger: ReactElement;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    fields: FieldDef[];
    /** Currently applied filters — seeds the draft when the popover opens. */
    appliedFilters: AppliedFilter[];
    /** Commit the staged draft as a single batch. */
    onApply: (filters: AppliedFilter[]) => void;
    /** Live count for a candidate filter set (no commit). */
    previewCount: (filters: AppliedFilter[]) => number;
    totalCount: number;
}

function cloneValue(v: FilterValue): FilterValue {
    return Array.isArray(v) ? [...v] : typeof v === "object" && v !== null ? { ...v } : v;
}

/**
 * Multi-filter builder (plan.md §2c). Compose several conditions, see a live "showing N of M"
 * preview, then Apply once — a single batched table update instead of per-keystroke thrash.
 */
export const FilterBuilder = ({ trigger, isOpen, onOpenChange, fields, appliedFilters, onApply, previewCount, totalCount }: FilterBuilderProps) => {
    const [draft, setDraft] = useState<AppliedFilter[]>([]);

    // Seed the draft from applied filters each time the popover opens. An effect is correct
    // here: the popover can be opened externally (e.g. by clicking a filter chip), so we must
    // sync the draft to that external `isOpen` change.
    useEffect(() => {
        if (isOpen) {
            const seed = appliedFilters.map((f) => ({ fieldId: f.fieldId, value: cloneValue(f.value) }));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDraft(seed.length ? seed : [{ fieldId: fields[0].id, value: emptyValue(fields[0].type) }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fieldFor = (id: string) => fields.find((f) => f.id === id)!;
    const nonEmpty = draft.filter((d) => !isEmpty(fieldFor(d.fieldId).type, d.value));
    const count = previewCount(nonEmpty);

    const update = (index: number, next: Partial<AppliedFilter>) => setDraft((d) => d.map((c, i) => (i === index ? { ...c, ...next } : c)));
    const changeField = (index: number, fieldId: string) => update(index, { fieldId, value: emptyValue(fieldFor(fieldId).type) });
    const changeValue = (index: number, value: FilterValue) => update(index, { value });
    const remove = (index: number) => setDraft((d) => d.filter((_, i) => i !== index));
    const addCondition = () => setDraft((d) => [...d, { fieldId: fields[0].id, value: emptyValue(fields[0].type) }]);

    const apply = () => {
        onApply(nonEmpty);
        onOpenChange(false);
    };

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
            {trigger}
            <Popover
                placement="bottom start"
                className={cx(
                    "w-[30rem] max-w-[calc(100vw-2rem)] rounded-xl border border-secondary bg-primary shadow-lg outline-none",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0",
                )}
            >
                <Dialog className="flex max-h-[80vh] flex-col outline-none" aria-label="Build filters">
                    <div className="border-b border-secondary px-4 py-3">
                        <h2 className="text-sm font-semibold text-primary">Filters</h2>
                        <p className="text-xs text-tertiary">All conditions must match (AND).</p>
                    </div>

                    <div className="flex flex-col gap-3 overflow-auto p-4">
                        {draft.map((cond, i) => {
                            const field = fieldFor(cond.fieldId);
                            return (
                                <div key={i} className="flex flex-col gap-2 rounded-lg border border-secondary p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <Select
                                            aria-label={`Field for condition ${i + 1}`}
                                            items={fields.map((f) => ({ id: f.id, label: f.label }))}
                                            selectedKey={cond.fieldId}
                                            onSelectionChange={(id) => id != null && changeField(i, String(id))}
                                            size="sm"
                                            className="w-44"
                                        >
                                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                        </Select>
                                        <Button color="tertiary" size="sm" onPress={() => remove(i)}>
                                            Remove
                                        </Button>
                                    </div>
                                    <FilterControl field={field} value={cond.value} onChange={(v) => changeValue(i, v)} />
                                </div>
                            );
                        })}

                        <Button color="tertiary" size="sm" iconLeading={Plus} onPress={addCondition} className="self-start">
                            Add condition
                        </Button>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-secondary px-4 py-3">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-tertiary">
                                Showing <span className="font-semibold text-primary">{count}</span> of {totalCount}
                            </span>
                            {draft.length > 0 && (
                                <Button color="tertiary" size="sm" onPress={() => setDraft([])}>
                                    Clear all
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button color="secondary" size="sm" onPress={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button color="primary" size="sm" onPress={apply}>
                                Apply filters
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
};
