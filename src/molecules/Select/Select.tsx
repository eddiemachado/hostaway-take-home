import { Check, ChevronDown } from "@untitledui/icons";
import {
    Select as AriaSelect,
    Button,
    ListBox,
    ListBoxItem,
    Popover,
    SelectValue,
    type Key,
} from "react-aria-components";
import { cx } from "@/utils/cx";

export interface SelectOption {
    id: string;
    label: string;
}

export interface SelectProps {
    options: SelectOption[];
    selectedKey?: string | null;
    onChange: (key: string) => void;
    placeholder?: string;
    "aria-label": string;
    size?: "sm" | "md";
    className?: string;
}

/** Single-select dropdown (React Aria Select). */
export const Select = ({ options, selectedKey, onChange, placeholder = "Select", size = "md", className, ...props }: SelectProps) => (
    <AriaSelect
        aria-label={props["aria-label"]}
        selectedKey={selectedKey ?? null}
        onSelectionChange={(key: Key | null) => key != null && onChange(String(key))}
        className={cx("flex flex-col gap-1.5", className)}
    >
        <Button
            className={cx(
                "flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-primary bg-primary px-3 text-left shadow-xs outline-none transition",
                "data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-0 data-[focus-visible]:outline-brand hover:bg-primary_hover",
                size === "sm" ? "h-9 text-sm" : "h-10 text-md",
            )}
        >
            <SelectValue className="truncate text-primary data-[placeholder]:text-placeholder">{({ defaultChildren, isPlaceholder }) => (isPlaceholder ? placeholder : defaultChildren)}</SelectValue>
            <ChevronDown className="size-5 shrink-0 text-fg-quaternary" />
        </Button>
        <Popover
            className={cx(
                "w-(--trigger-width) rounded-lg border border-secondary bg-primary p-1 shadow-lg outline-none",
                "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0",
            )}
        >
            <ListBox items={options} className="max-h-64 overflow-auto outline-none">
                {(item) => (
                    <ListBoxItem
                        id={item.id}
                        textValue={item.label}
                        className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-secondary outline-none data-[focused]:bg-secondary_hover data-[selected]:font-semibold data-[selected]:text-primary"
                    >
                        {({ isSelected }) => (
                            <>
                                <span className="truncate">{item.label}</span>
                                {isSelected && <Check className="size-4 shrink-0 text-fg-brand-primary" />}
                            </>
                        )}
                    </ListBoxItem>
                )}
            </ListBox>
        </Popover>
    </AriaSelect>
);
