import { Tabs, TabList, Tab, type Key } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface TabItem {
    id: string;
    label: string;
    /** Optional count badge. */
    count?: number;
}

export interface TabNavProps {
    tabs: TabItem[];
    selectedKey: string;
    onSelectionChange: (key: string) => void;
    "aria-label": string;
    className?: string;
}

/** Underline tab navigation (React Aria Tabs). Drives a view/filter selection. */
export const TabNav = ({ tabs, selectedKey, onSelectionChange, className, ...props }: TabNavProps) => (
    <Tabs
        selectedKey={selectedKey}
        onSelectionChange={(key: Key) => onSelectionChange(String(key))}
        className={className}
        aria-label={props["aria-label"]}
    >
        <TabList className="-mb-px flex gap-1 border-b border-secondary" items={tabs}>
            {(tab) => (
                <Tab
                    id={tab.id}
                    className={({ isSelected }) =>
                        cx(
                            "flex cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold outline-none transition",
                            "focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                            isSelected
                                ? "border-brand text-brand-secondary"
                                : "border-transparent text-quaternary hover:text-tertiary",
                        )
                    }
                >
                    {({ isSelected }) => (
                        <>
                            {tab.label}
                            {tab.count != null && (
                                <span
                                    className={cx(
                                        "rounded-full px-1.5 py-0.5 text-xs font-medium",
                                        isSelected ? "bg-utility-brand-50 text-utility-brand-700" : "bg-utility-neutral-50 text-utility-neutral-700",
                                    )}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </>
                    )}
                </Tab>
            )}
        </TabList>
    </Tabs>
);
