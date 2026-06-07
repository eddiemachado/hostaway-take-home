import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import type { DateValue, EnumValue, FieldDef, FilterValue, NumberValue, TextValue } from "@/lib/filtering";

export interface FilterControlProps {
    field: FieldDef;
    value: FilterValue;
    onChange: (value: FilterValue) => void;
    className?: string;
}

/**
 * Renders the right value editor for a field's type, composed from Untitled UI components:
 *   enum → multi-select checkboxes · text → contains · number → min/max · date → range.
 * One molecule, many field types — see plan.md §2c.
 */
export const FilterControl = ({ field, value, onChange, className }: FilterControlProps) => {
    return (
        <div className={cx("flex flex-col gap-2", className)}>
            {field.type === "enum" && <EnumControl field={field} value={value as EnumValue} onChange={onChange} />}
            {field.type === "text" && <TextControl value={value as TextValue} onChange={onChange} label={field.label} />}
            {field.type === "number" && <NumberControl value={value as NumberValue} onChange={onChange} />}
            {field.type === "date" && <DateControl value={value as DateValue} onChange={onChange} />}
        </div>
    );
};

function EnumControl({ field, value, onChange }: { field: FieldDef; value: EnumValue; onChange: (v: EnumValue) => void }) {
    const toggle = (optionValue: string, checked: boolean) => {
        onChange(checked ? [...value, optionValue] : value.filter((v) => v !== optionValue));
    };
    return (
        <div className="flex max-h-56 flex-col gap-0.5 overflow-auto">
            {field.options?.map((opt) => (
                <div key={opt.value} className="rounded-md px-1 py-1.5 hover:bg-secondary">
                    <Checkbox isSelected={value.includes(opt.value)} onChange={(checked) => toggle(opt.value, checked)} label={opt.label} />
                </div>
            ))}
        </div>
    );
}

function TextControl({ value, onChange, label }: { value: TextValue; onChange: (v: TextValue) => void; label: string }) {
    return <Input size="sm" placeholder="Contains…" aria-label={label} value={value} onChange={(v) => onChange(v)} />;
}

function NumberControl({ value, onChange }: { value: NumberValue; onChange: (v: NumberValue) => void }) {
    const setPart = (part: "min" | "max", raw: string) => {
        const num = raw === "" ? undefined : Number(raw);
        onChange({ ...value, [part]: Number.isNaN(num as number) ? undefined : num });
    };
    return (
        <div className="flex items-center gap-2">
            <Input size="sm" type="number" placeholder="Min" aria-label="Minimum" value={value.min?.toString() ?? ""} onChange={(v) => setPart("min", v)} />
            <span className="text-sm text-quaternary">–</span>
            <Input size="sm" type="number" placeholder="Max" aria-label="Maximum" value={value.max?.toString() ?? ""} onChange={(v) => setPart("max", v)} />
        </div>
    );
}

// Uses Untitled UI Input (type=date) to keep ISO-string values in our filter model.
// A richer option is UUI's DateRangePicker (CalendarDate-based) — noted as a future enhancement.
function DateControl({ value, onChange }: { value: DateValue; onChange: (v: DateValue) => void }) {
    return (
        <div className="flex items-center gap-2">
            <Input size="sm" type="date" aria-label="From date" value={value.from ?? ""} onChange={(v) => onChange({ ...value, from: v || undefined })} />
            <span className="text-sm text-quaternary">→</span>
            <Input size="sm" type="date" aria-label="To date" value={value.to ?? ""} onChange={(v) => onChange({ ...value, to: v || undefined })} />
        </div>
    );
}
