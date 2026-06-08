import { Moon01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";
import { cx } from "@/utils/cx";

const BASE = import.meta.env.BASE_URL;
const LINKS = [
    { id: "slides", label: "Slides", href: `${BASE}site.html` },
    { id: "reservations", label: "Reservations", href: BASE },
] as const;

export interface SiteHeaderProps {
    /** Which surface is currently shown — highlights its nav link. */
    current: "slides" | "reservations";
    /** Optional kicker chip (e.g. the deck's section label). */
    kicker?: string;
    /** Show the bottom border + shadow (scroll-aware). */
    elevated?: boolean;
}

/**
 * Consistent top chrome shared by the slide deck and the Reservations app, so you can navigate
 * between the two surfaces. Houses the project label, cross-links, and the theme toggle.
 */
export function SiteHeader({ current, kicker, elevated = false }: SiteHeaderProps) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <header
            className={cx(
                "z-20 flex h-14 shrink-0 items-center justify-between bg-primary px-5 transition-shadow duration-200",
                elevated ? "border-b border-secondary shadow-[0_8px_16px_-12px_rgba(10,13,18,0.12)]" : "border-b border-transparent",
            )}
        >
            <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-primary">
                    Eddie Machado <span className="text-tertiary">- Hostaway task</span>
                </span>
                {kicker && (
                    <span className="ml-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold tracking-wide text-tertiary uppercase">{kicker}</span>
                )}
            </div>

            <nav className="flex items-center gap-1">
                {LINKS.map((link) => (
                    <a
                        key={link.id}
                        href={link.href}
                        aria-current={link.id === current ? "page" : undefined}
                        className={cx(
                            "rounded-lg px-3 py-2 text-sm font-semibold outline-none transition duration-150 ease-out active:scale-95",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                            link.id === current ? "text-brand-secondary" : "text-secondary hover:bg-primary_hover",
                        )}
                    >
                        {link.label}
                    </a>
                ))}
                <span className="mx-1 h-5 w-px bg-border-secondary" aria-hidden="true" />
                <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-primary bg-primary text-fg-quaternary shadow-xs transition duration-150 ease-out hover:bg-primary_hover hover:text-fg-quaternary_hover active:scale-95"
                >
                    {isDark ? <Sun className="size-5" /> : <Moon01 className="size-5" />}
                </button>
            </nav>
        </header>
    );
}
