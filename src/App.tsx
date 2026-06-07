import { Moon01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";

/**
 * Foundations verification page.
 *
 * Temporary: confirms the Untitled UI token layer (light + dark), the type scale, and the
 * theme toggle all work before we start building atoms. This page will be replaced by the
 * Reservations page once the system is in place.
 */
function App() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    const swatches = [
        { label: "bg-primary", className: "bg-primary border-secondary" },
        { label: "bg-secondary", className: "bg-secondary border-secondary" },
        { label: "bg-tertiary", className: "bg-tertiary border-secondary" },
        { label: "bg-brand-solid", className: "bg-brand-solid border-transparent" },
        { label: "bg-success-solid", className: "bg-success-solid border-transparent" },
        { label: "bg-error-solid", className: "bg-error-solid border-transparent" },
    ];

    const typeScale = [
        { label: "display-md", className: "text-display-md font-semibold" },
        { label: "display-sm", className: "text-display-sm font-semibold" },
        { label: "xl", className: "text-xl font-semibold" },
        { label: "lg", className: "text-lg font-medium" },
        { label: "md", className: "text-md" },
        { label: "sm", className: "text-sm text-secondary" },
    ];

    return (
        <main className="min-h-screen bg-primary px-6 py-10 md:px-10">
            <div className="mx-auto flex max-w-3xl flex-col gap-10">
                <header className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-display-sm font-semibold text-primary">Foundations check</h1>
                        <p className="text-md text-tertiary">Untitled UI tokens · light + dark · type scale</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-xs transition hover:bg-primary_hover"
                    >
                        {isDark ? <Sun className="size-5" /> : <Moon01 className="size-5" />}
                        {isDark ? "Light" : "Dark"}
                    </button>
                </header>

                <section className="flex flex-col gap-4">
                    <h2 className="text-sm font-semibold tracking-wide text-tertiary uppercase">Semantic surfaces</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {swatches.map((s) => (
                            <div key={s.label} className="flex flex-col gap-2">
                                <div className={`h-16 rounded-xl border ${s.className}`} />
                                <code className="text-xs text-tertiary">{s.label}</code>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-sm font-semibold tracking-wide text-tertiary uppercase">Brand scale</h2>
                    <div className="flex overflow-hidden rounded-xl border border-secondary">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                            <div
                                key={shade}
                                className="h-12 flex-1"
                                style={{ backgroundColor: `var(--color-brand-${shade})` }}
                                title={`brand-${shade}`}
                            />
                        ))}
                    </div>
                </section>

                <section className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold tracking-wide text-tertiary uppercase">Type scale</h2>
                    {typeScale.map((t) => (
                        <div key={t.label} className="flex items-baseline gap-4">
                            <code className="w-28 shrink-0 text-xs text-quaternary">{t.label}</code>
                            <span className={`text-primary ${t.className}`}>The quick brown fox</span>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}

export default App;
