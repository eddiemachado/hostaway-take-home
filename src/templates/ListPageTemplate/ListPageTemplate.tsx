import type { FC, ReactNode } from "react";
import { Bell01, Building02, CalendarCheck01, LayoutAlt01, Moon01, Settings01, Sun, User01 } from "@untitledui/icons";
import { Avatar } from "@/atoms/Avatar";
import { IconButton } from "@/atoms/IconButton";
import { useTheme } from "@/providers/theme-provider";
import { cx } from "@/utils/cx";

export interface ListPageTemplateProps {
    /** Page header slot (e.g. <PageHeader />). */
    header?: ReactNode;
    /** Toolbar slot (search + view/filter actions). */
    toolbar?: ReactNode;
    /** Applied-filters bar slot. */
    filters?: ReactNode;
    /** Main content — typically the DataTable. */
    children?: ReactNode;
    /** Footer slot — typically Pagination. */
    footer?: ReactNode;
}

const NAV: { label: string; icon: FC<{ className?: string }>; active?: boolean }[] = [
    { label: "Dashboard", icon: LayoutAlt01 },
    { label: "Reservations", icon: CalendarCheck01, active: true },
    { label: "Listings", icon: Building02 },
    { label: "Guests", icon: User01 },
    { label: "Settings", icon: Settings01 },
];

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    return (
        <IconButton
            variant="tertiary"
            icon={isDark ? Sun : Moon01}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onPress={() => setTheme(isDark ? "light" : "dark")}
        />
    );
}

/**
 * Application shell + list-page layout. Named slots (header / toolbar / filters / content /
 * footer) keep the *page* free of chrome concerns — the template owns structure, the page
 * owns content. (Atomic design: template → page.)
 */
export const ListPageTemplate = ({ header, toolbar, filters, children, footer }: ListPageTemplateProps) => (
    <div className="flex h-screen bg-secondary">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col gap-1 border-r border-secondary bg-primary px-4 py-6 md:flex">
            <div className="mb-6 flex items-center gap-2 px-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-solid text-sm font-bold text-white">H</span>
                <span className="text-lg font-semibold text-primary">Hostaway</span>
            </div>
            <nav className="flex flex-col gap-1">
                {NAV.map((item) => (
                    <a
                        key={item.label}
                        href="#"
                        aria-current={item.active ? "page" : undefined}
                        className={cx(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
                            item.active ? "bg-active text-secondary" : "text-tertiary hover:bg-primary_hover hover:text-secondary",
                        )}
                    >
                        <item.icon className="size-5 shrink-0" />
                        {item.label}
                    </a>
                ))}
            </nav>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
            {/* Topbar */}
            <div className="flex h-16 shrink-0 items-center justify-end gap-1 border-b border-secondary bg-primary px-6">
                <ThemeToggle />
                <IconButton variant="tertiary" icon={Bell01} aria-label="Notifications" />
                <span className="ml-2">
                    <Avatar name="Ava Reyes" size="sm" />
                </span>
            </div>

            {/* Scrollable content */}
            <main className="flex-1 overflow-auto">
                <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-8">
                    {header}
                    {(toolbar || filters) && (
                        <div className="flex flex-col gap-4">
                            {toolbar}
                            {filters}
                        </div>
                    )}
                    {children}
                    {footer}
                </div>
            </main>
        </div>
    </div>
);
