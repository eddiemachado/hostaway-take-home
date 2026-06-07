import type { ReactNode } from "react";
import { Checkbox as AriaCheckbox, type CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface CheckboxProps extends Omit<AriaCheckboxProps, "children" | "className"> {
    /** Optional visible label rendered after the box. */
    label?: ReactNode;
    className?: string;
}

/** Accessible checkbox (React Aria) supporting checked + indeterminate states. */
export const Checkbox = ({ label, className, ...props }: CheckboxProps) => (
    <AriaCheckbox {...props} className={cx("group inline-flex cursor-pointer items-center gap-2", className)}>
        {({ isSelected, isIndeterminate }) => (
            <>
                <span
                    className={cx(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border text-white transition",
                        "group-data-[focus-visible]:outline-2 group-data-[focus-visible]:outline-offset-2 group-data-[focus-visible]:outline-brand",
                        isSelected || isIndeterminate ? "border-brand-solid bg-brand-solid" : "border-primary bg-primary",
                    )}
                    aria-hidden="true"
                >
                    {isIndeterminate ? (
                        <svg viewBox="0 0 16 16" className="size-3" fill="none">
                            <path d="M3.5 8h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : isSelected ? (
                        <svg viewBox="0 0 16 16" className="size-3" fill="none">
                            <path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : null}
                </span>
                {label && <span className="text-sm text-secondary">{label}</span>}
            </>
        )}
    </AriaCheckbox>
);
