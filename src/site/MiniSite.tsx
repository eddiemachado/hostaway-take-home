import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Moon01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";
// Content is rendered verbatim from the source docs — never edited or duplicated here.
import auditContent from "../../docs/01-audit.md?raw";
import roadmapContent from "../../docs/roadmap.md?raw";

/** Scroll-reveal for every top-level block in the rendered docs. Motion-safe. */
function useScrollReveal() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const blocks = Array.from(document.querySelectorAll<HTMLElement>(".prose > *"));
        blocks.forEach((b) => b.classList.add("reveal-init"));

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-in");
                        io.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
        );
        blocks.forEach((b) => io.observe(b));
        return () => io.disconnect();
    }, []);
}

/** Thin scroll-progress bar at the top of the viewport. */
function useScrollProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return progress;
}

export function MiniSite() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const progress = useScrollProgress();
    useScrollReveal();

    return (
        <div className="min-h-screen bg-secondary">
            <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

            {/* Sticky chrome — logo mark + theme toggle only (no added copy). */}
            <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-secondary bg-primary/80 px-5 backdrop-blur-md">
                <span className="flex size-7 items-center justify-center rounded-lg bg-brand-solid text-sm font-bold text-white" aria-hidden="true">
                    H
                </span>
                <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-primary bg-primary text-fg-quaternary shadow-xs transition duration-150 ease-out hover:bg-primary_hover hover:text-fg-quaternary_hover active:scale-95"
                >
                    {isDark ? <Sun className="size-5" /> : <Moon01 className="size-5" />}
                </button>
            </header>

            <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-12 md:py-16">
                <section className="rounded-2xl bg-primary p-6 shadow-sm ring-1 ring-secondary md:p-10">
                    <div className="prose">
                        <Markdown remarkPlugins={[remarkGfm]}>{auditContent}</Markdown>
                    </div>
                </section>

                <section className="rounded-2xl bg-primary p-6 shadow-sm ring-1 ring-secondary md:p-10">
                    <div className="prose">
                        <Markdown remarkPlugins={[remarkGfm]}>{roadmapContent}</Markdown>
                    </div>
                </section>
            </main>
        </div>
    );
}
