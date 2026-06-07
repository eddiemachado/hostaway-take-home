import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface PageHeaderProps {
    title: string;
    description?: string;
    /** Page-level actions (compose Buttons here). */
    actions?: ReactNode;
    /** Tab navigation slot (compose a <TabNav /> here). */
    tabs?: ReactNode;
    className?: string;
}

/**
 * Composed page header — `Title + (description) + ActionGroup + TabNav` — NOT a monolithic
 * variant block. This is the audit's headline fix: composition replaces `variant="quaternary"`.
 */
export const PageHeader = ({ title, description, actions, tabs, className }: PageHeaderProps) => (
    <header className={cx("flex flex-col gap-5", className)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-display-xs font-semibold text-primary">{title}</h1>
                {description && <p className="text-md text-tertiary">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
        {tabs}
    </header>
);
