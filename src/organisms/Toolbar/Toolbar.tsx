import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface ToolbarProps {
    /** Left cluster — typically search. */
    left?: ReactNode;
    /** Right cluster — typically saved-views + add-filter. */
    right?: ReactNode;
    className?: string;
}

/** Table toolbar row: left (search) and right (view/filter actions) clusters. */
export const Toolbar = ({ left, right, className }: ToolbarProps) => (
    <div className={cx("flex flex-wrap items-center justify-between gap-3", className)}>
        <div className="flex min-w-48 max-w-md flex-1 items-center gap-2">{left}</div>
        <div className="flex items-center gap-2">{right}</div>
    </div>
);
