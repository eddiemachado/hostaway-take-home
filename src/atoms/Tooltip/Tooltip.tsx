import type { ReactElement, ReactNode } from "react";
import { Tooltip as AriaTooltip, TooltipTrigger, type Placement } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface TooltipProps {
    /** Tooltip content. */
    title: ReactNode;
    /** A focusable React Aria trigger (Button, IconButton, Link). */
    children: ReactElement;
    placement?: Placement;
    /** Open delay in ms. @default 300 */
    delay?: number;
    className?: string;
}

/** Hover/focus tooltip (React Aria). The trigger must be focusable for keyboard users. */
export const Tooltip = ({ title, children, placement = "top", delay = 300, className }: TooltipProps) => (
    <TooltipTrigger delay={delay}>
        {children}
        <AriaTooltip
            offset={8}
            placement={placement}
            className={cx(
                "z-50 max-w-xs rounded-lg bg-primary-solid px-3 py-2 text-xs font-medium text-white shadow-lg",
                "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0",
                className,
            )}
        >
            {title}
        </AriaTooltip>
    </TooltipTrigger>
);
