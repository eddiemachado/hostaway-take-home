import { X } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export interface FilterChipProps {
    /** Field name, e.g. "Channel". */
    label: string;
    /** Summarized value, e.g. "Airbnb, Vrbo". */
    value: string;
    /** Edit the filter (click chip body). */
    onClick?: () => void;
    /** Remove the filter. */
    onRemove: () => void;
    className?: string;
}

/** An applied-filter pill: editable body + remove button. */
export const FilterChip = ({ label, value, onClick, onRemove, className }: FilterChipProps) => (
    <span
        className={cx(
            "inline-flex items-center overflow-hidden rounded-lg border border-primary bg-primary text-sm shadow-xs",
            className,
        )}
    >
        <button
            type="button"
            onClick={onClick}
            className="flex cursor-pointer items-center gap-1.5 py-1.5 pr-2 pl-2.5 outline-none transition hover:bg-primary_hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        >
            <span className="font-medium text-tertiary">{label}</span>
            <span className="font-semibold text-primary">{value}</span>
        </button>
        <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${label} filter`}
            className="flex h-full cursor-pointer items-center border-l border-primary px-1.5 text-fg-quaternary outline-none transition hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        >
            <X className="size-4" />
        </button>
    </span>
);
