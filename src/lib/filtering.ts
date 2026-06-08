/**
 * Generic, type-aware filtering model shared by FilterControl, FilterBuilder, FilterBar,
 * and the page that applies filters to its data.
 *
 * Design notes (see plan.md §2c):
 *  - Each field has a `type` that drives both its editor UI and its match logic.
 *  - Multiple filters combine with AND; values *within* an enum filter combine with OR.
 *  - Filters are staged in the FilterBuilder and applied as a batch (no per-keystroke thrash).
 */

export type FieldType = "enum" | "text" | "number" | "date";

export interface FieldOption {
    value: string;
    label: string;
}

export interface FieldDef {
    id: string;
    label: string;
    type: FieldType;
    /** Options for `enum` fields. */
    options?: FieldOption[];
    /** Read the comparable raw value from a row. */
    accessor: (row: unknown) => unknown;
}

export type EnumValue = string[];
export type TextValue = string;
export type NumberValue = { min?: number; max?: number };
export type DateValue = { from?: string; to?: string };
export type FilterValue = EnumValue | TextValue | NumberValue | DateValue;

export interface AppliedFilter {
    fieldId: string;
    value: FilterValue;
}

/** A blank value for a freshly added filter of the given type. */
export function emptyValue(type: FieldType): FilterValue {
    switch (type) {
        case "enum":
            return [];
        case "text":
            return "";
        case "number":
            return {};
        case "date":
            return {};
    }
}

/** True when a filter has no meaningful constraint (and should be ignored). */
export function isEmpty(type: FieldType, value: FilterValue): boolean {
    switch (type) {
        case "enum":
            return (value as EnumValue).length === 0;
        case "text":
            return (value as TextValue).trim() === "";
        case "number": {
            const v = value as NumberValue;
            return v.min == null && v.max == null;
        }
        case "date": {
            const v = value as DateValue;
            return !v.from && !v.to;
        }
    }
}

/** Human-readable summary used on a filter chip, e.g. "Channel: Airbnb, Vrbo". */
export function summarize(field: FieldDef, value: FilterValue): string {
    switch (field.type) {
        case "enum": {
            const selected = value as EnumValue;
            const labels = selected.map((v) => field.options?.find((o) => o.value === v)?.label ?? v);
            return labels.length <= 2 ? labels.join(", ") : `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
        }
        case "text":
            return `“${(value as TextValue).trim()}”`;
        case "number": {
            const v = value as NumberValue;
            if (v.min != null && v.max != null) return `${v.min}–${v.max}`;
            if (v.min != null) return `≥ ${v.min}`;
            return `≤ ${v.max}`;
        }
        case "date": {
            const v = value as DateValue;
            if (v.from && v.to) return `${v.from} → ${v.to}`;
            if (v.from) return `from ${v.from}`;
            return `until ${v.to}`;
        }
    }
}

/** Whether a single row's raw value satisfies one filter. */
export function matches(type: FieldType, raw: unknown, value: FilterValue): boolean {
    if (isEmpty(type, value)) return true;
    switch (type) {
        case "enum":
            return (value as EnumValue).includes(String(raw));
        case "text":
            return String(raw).toLowerCase().includes((value as TextValue).trim().toLowerCase());
        case "number": {
            const v = value as NumberValue;
            const n = Number(raw);
            if (v.min != null && n < v.min) return false;
            if (v.max != null && n > v.max) return false;
            return true;
        }
        case "date": {
            const v = value as DateValue;
            const d = String(raw); // ISO yyyy-mm-dd, lexicographically comparable
            if (v.from && d < v.from) return false;
            if (v.to && d > v.to) return false;
            return true;
        }
    }
}

/** Canonical, comparable form of a single filter value (order-independent for enums). */
function canonicalValue(type: FieldType, value: FilterValue): unknown {
    switch (type) {
        case "enum":
            return [...(value as EnumValue)].sort();
        case "text":
            return (value as TextValue).trim().toLowerCase();
        case "number": {
            const v = value as NumberValue;
            return { min: v.min ?? null, max: v.max ?? null };
        }
        case "date": {
            const v = value as DateValue;
            return { from: v.from ?? null, to: v.to ?? null };
        }
    }
}

/**
 * Order-independent equality between two filter sets, ignoring empty conditions. Used to derive
 * which view (system tab or saved view) the current filters correspond to.
 */
export function filtersEqual(a: AppliedFilter[], b: AppliedFilter[], fields: FieldDef[]): boolean {
    const norm = (filters: AppliedFilter[]) =>
        filters
            .filter((f) => {
                const field = fields.find((x) => x.id === f.fieldId);
                return field && !isEmpty(field.type, f.value);
            })
            .map((f) => {
                const field = fields.find((x) => x.id === f.fieldId)!;
                return { fieldId: f.fieldId, value: canonicalValue(field.type, f.value) };
            })
            .sort((x, y) => {
                const k = `${x.fieldId}:${JSON.stringify(x.value)}`;
                const l = `${y.fieldId}:${JSON.stringify(y.value)}`;
                return k < l ? -1 : k > l ? 1 : 0;
            });
    return JSON.stringify(norm(a)) === JSON.stringify(norm(b));
}

/** Apply a set of filters to rows (AND across filters). */
export function applyFilters<T>(rows: T[], filters: AppliedFilter[], fields: FieldDef[]): T[] {
    const active = filters.filter((f) => {
        const field = fields.find((x) => x.id === f.fieldId);
        return field && !isEmpty(field.type, f.value);
    });
    if (active.length === 0) return rows;

    return rows.filter((row) =>
        active.every((f) => {
            const field = fields.find((x) => x.id === f.fieldId)!;
            return matches(field.type, field.accessor(row), f.value);
        }),
    );
}
