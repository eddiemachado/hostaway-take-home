import type { FC, ReactElement } from "react";
import { Menu as AriaMenu, MenuItem, MenuTrigger, Popover, type Key } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface MenuAction {
    id: string;
    label: string;
    icon?: FC<{ className?: string }>;
    danger?: boolean;
    onAction: () => void;
}

export interface MenuProps {
    /** A focusable React Aria trigger (Button / IconButton). */
    trigger: ReactElement;
    items: MenuAction[];
    "aria-label": string;
    placement?: "bottom start" | "bottom end" | "top start" | "top end";
}

/** Dropdown action menu (React Aria Menu). */
export const Menu = ({ trigger, items, placement = "bottom end", ...props }: MenuProps) => (
    <MenuTrigger>
        {trigger}
        <Popover
            placement={placement}
            className={cx(
                "min-w-44 rounded-lg border border-secondary bg-primary p-1 shadow-lg outline-none",
                "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0",
            )}
        >
            <AriaMenu
                aria-label={props["aria-label"]}
                className="outline-none"
                items={items}
                onAction={(key: Key) => items.find((i) => i.id === String(key))?.onAction()}
            >
                {(item) => (
                    <MenuItem
                        id={item.id}
                        textValue={item.label}
                        className={cx(
                            "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition",
                            "data-[focused]:bg-secondary_hover",
                            item.danger ? "text-error-primary" : "text-secondary",
                        )}
                    >
                        {item.icon && <item.icon className="size-4 shrink-0" />}
                        {item.label}
                    </MenuItem>
                )}
            </AriaMenu>
        </Popover>
    </MenuTrigger>
);
