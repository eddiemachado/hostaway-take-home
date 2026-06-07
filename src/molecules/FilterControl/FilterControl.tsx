import { Checkbox } from "@/atoms/Checkbox";
import { Input } from "@/atoms/Input";
import { cx } from "@/utils/cx";
import type { DateValue, EnumValue, FieldDef, FilterValue, NumberValue, TextValue } from "@/lib/filtering";

export interface FilterControlProps {
    field: FieldDef;
    value: FilterValue;
    onChange: (value: FilterValue) => void;
    className?: string;
}

/**
 * Renders the right value editor for a field's type:
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
        <div className="flex max-h-56 flex-col gap-1 overflow-auto">
            {field.options?.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 hover:bg-secondary_hover">
                    <Checkbox isSelected={value.includes(opt.value)} onChange={(checked) => toggle(opt.value, checked)} aria-label={opt.label} />
                    <span className="text-sm text-secondary">{opt.label}</span>
                </label>
            ))}
        </div>
    );
}

function TextControl({ value, onChange, label }: { value: TextValue; onChange: (v: TextValue) => void; label: string }) {
    return <Input inputSize="sm" placeholder={`Contains…`} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function NumberControl({ value, onChange }: { value: NumberValue; onChange: (v: NumberValue) => void }) {
    const setPart = (part: "min" | "max", raw: string) => {
        const num = raw === "" ? undefined : Number(raw);
        onChange({ ...value, [part]: Number.isNaN(num as number) ? undefined : num });
    };
    return (
        <div className="flex items-center gap-2">
            <Input inputSize="sm" type="number" placeholder="Min" aria-label="Minimum" value={value.min ?? ""} onChange={(e) => setPart("min", e.target.value)} />
            <span className="text-sm text-quaternary">–</span>
            <Input inputSize="sm" type="number" placeholder="Max" aria-label="Maximum" value={value.max ?? ""} onChange={(e) => setPart("max", e.target.value)} />
        </div>
    );
}

// NOTE: native date inputs for now. Production swaps to React Aria DateRangePicker
// (see plan.md — decision recorded). Kept lightweight to keep the multi-filter flow moving.
function DateControl({ value, onChange }: { value: DateValue; onChange: (v: DateValue) => void }) {
    return (
        <div className="flex items-center gap-2">
            <Input inputSize="sm" type="date" aria-label="From date" value={value.from ?? ""} onChange={(e) => onChange({ ...value, from: e.target.value || undefined })} />
            <span className="text-sm text-quaternary">→</span>
            <Input inputSize="sm" type="date" aria-label="To date" value={value.to ?? ""} onChange={(e) => onChange({ ...value, to: e.target.value || undefined })} />
        </div>
    );
}
