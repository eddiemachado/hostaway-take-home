import type { FC, InputHTMLAttributes, Ref } from "react";
import { cx } from "@/utils/cx";

export type InputSize = "sm" | "md";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    /** Optional leading icon component. */
    icon?: FC<{ className?: string }>;
    inputSize?: InputSize;
    /** Render error styling (pair with aria-invalid for SRs). */
    isInvalid?: boolean;
    ref?: Ref<HTMLInputElement>;
}

const sizes: Record<InputSize, string> = {
    sm: "h-9 text-sm",
    md: "h-10 text-md",
};

/** Styled text input with optional leading icon. Provide a label via the consumer. */
export const Input = ({ icon: Icon, inputSize = "md", isInvalid, className, ref, ...props }: InputProps) => (
    <div
        className={cx(
            "flex items-center gap-2 rounded-lg border bg-primary px-3 shadow-xs transition",
            "border-primary focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-brand",
            isInvalid && "border-error focus-within:outline-error",
            sizes[inputSize],
            className,
        )}
    >
        {Icon && <Icon className="size-5 shrink-0 text-fg-quaternary" />}
        <input
            ref={ref}
            aria-invalid={isInvalid || undefined}
            className="w-full min-w-0 bg-transparent text-primary outline-none placeholder:text-placeholder"
            {...props}
        />
    </div>
);
