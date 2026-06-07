import type { ReactNode } from "react";
import { Button } from "@/components/base/buttons/button";
import { FilterChip } from "@/molecules/FilterChip";
import { cx } from "@/utils/cx";
import { summarize, type AppliedFilter, type FieldDef } from "@/lib/filtering";

export interface FilterBarProps {
    fields: FieldDef[];
    filters: AppliedFilter[];
    /** Open the builder to edit (chip click). */
    onEditFilters?: () => void;
    /** Remove one applied filter by index. */
    onRemoveFilter: (index: number) => void;
    onClearAll: () => void;
    resultCount: number;
    totalCount: number;
    /** "Add filter" trigger (the FilterBuilder lives here). */
    addButton?: ReactNode;
    /** Saved-views control slot. */
    savedViews?: ReactNode;
    className?: string;
}

/** Applied-filters bar: chips (AND), add/saved-views slots, clear all, and a result count. */
export const FilterBar = ({ fields, filters, onEditFilters, onRemoveFilter, onClearAll, resultCount, totalCount, addButton, savedViews, className }: FilterBarProps) => {
    const fieldFor = (id: string) => fields.find((f) => f.id === id);

    return (
        <div className={cx("flex flex-wrap items-center gap-2", className)}>
            {addButton}
            {savedViews}

            {filters.map((f, i) => {
                const field = fieldFor(f.fieldId);
                if (!field) return null;
                return (
                    <FilterChip
                        key={`${f.fieldId}-${i}`}
                        label={field.label}
                        value={summarize(field, f.value)}
                        onClick={onEditFilters}
                        onRemove={() => onRemoveFilter(i)}
                    />
                );
            })}

            {filters.length > 0 && (
                <Button color="tertiary" size="sm" onPress={onClearAll}>
                    Clear all
                </Button>
            )}

            <span className="ml-auto shrink-0 text-sm text-tertiary" aria-live="polite">
                Showing <span className="font-semibold text-primary">{resultCount}</span> of {totalCount}
            </span>
        </div>
    );
};
