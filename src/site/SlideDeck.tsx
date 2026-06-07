import { useCallback, useEffect, useMemo, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowLeft, ArrowRight, Moon01, Sun } from "@untitledui/icons";
import { useTheme } from "@/providers/theme-provider";
// Rendered verbatim from the source docs — split into slides structurally, never edited.
import auditContent from "../../docs/01-audit.md?raw";
import roadmapContent from "../../docs/roadmap.md?raw";

/**
 * Split a markdown doc into slides at every H1–H3 heading (fence-aware, so headings inside
 * code blocks don't trigger a split). Strips bare `---` dividers and trims — no information is
 * added or removed, only the section structure is used as slide boundaries.
 */
function splitSlides(md: string): string[] {
    const lines = md.split("\n");
    const slides: string[] = [];
    let current: string[] = [];
    let inFence = false;

    for (const line of lines) {
        if (/^\s*```/.test(line)) inFence = !inFence;
        const isHeading = !inFence && /^#{1,3} /.test(line);
        if (isHeading && current.some((l) => l.trim() !== "")) {
            slides.push(current.join("\n"));
            current = [];
        }
        current.push(line);
    }
    if (current.length) slides.push(current.join("\n"));

    return slides
        .map((s) => s.replace(/^\s*-{3,}\s*$/gm, "").trim())
        .filter((s) => s.length > 0);
}

const AUDIT_SLIDES = splitSlides(auditContent);
const ROADMAP_SLIDES = splitSlides(roadmapContent);
const SLIDES: { section: "Audit" | "Roadmap"; md: string }[] = [
    ...AUDIT_SLIDES.map((md) => ({ section: "Audit" as const, md })),
    ...ROADMAP_SLIDES.map((md) => ({ section: "Roadmap" as const, md })),
];

/** Markdown renderers: fenced code → syntax-highlighted block with line numbers; inline code stays inline. */
function makeComponents(isDark: boolean): Components {
    return {
        // Code blocks render their own <pre>, so make Markdown's wrapper a pass-through.
        pre: ({ children }) => <>{children}</>,
        code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            if (match) {
                return (
                    <SyntaxHighlighter
                        language={match[1]}
                        style={isDark ? oneDark : oneLight}
                        showLineNumbers
                        customStyle={{
                            margin: "1.25rem 0",
                            padding: "1rem 1.25rem",
                            borderRadius: "0.625rem",
                            border: "1px solid var(--color-border-secondary)",
                            background: "var(--color-bg-secondary)",
                            fontSize: "0.8125rem",
                        }}
                        codeTagProps={{ style: { background: "transparent", fontSize: "0.8125rem" } }}
                        lineNumberStyle={{ minWidth: "2.25em", paddingRight: "1em", color: "var(--color-text-quaternary)", userSelect: "none" }}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                );
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };
}

export function SlideDeck() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const [index, setIndex] = useState(0);
    const total = SLIDES.length;
    const components = useMemo(() => makeComponents(isDark), [isDark]);

    const goTo = useCallback((n: number) => setIndex(() => Math.min(total - 1, Math.max(0, n))), [total]);
    const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);
    const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [total]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (["ArrowRight", "PageDown", " "].includes(e.key)) {
                e.preventDefault();
                next();
            } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
                e.preventDefault();
                prev();
            } else if (e.key === "Home") {
                goTo(0);
            } else if (e.key === "End") {
                goTo(total - 1);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [next, prev, goTo, total]);

    const slide = SLIDES[index];
    const progress = ((index + 1) / total) * 100;

    return (
        <div className="flex h-screen flex-col bg-primary">
            {/* progress */}
            <div className="h-0.5 w-full bg-transparent">
                <div className="h-full bg-brand-solid transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} aria-hidden="true" />
            </div>

            {/* top chrome */}
            <header className="flex h-14 shrink-0 items-center justify-between px-5">
                <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-brand-solid text-sm font-bold text-white" aria-hidden="true">H</span>
                    <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">{slide.section}</span>
                </div>
                <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-primary bg-primary text-fg-quaternary shadow-xs transition duration-150 ease-out hover:bg-primary_hover hover:text-fg-quaternary_hover active:scale-95"
                >
                    {isDark ? <Sun className="size-5" /> : <Moon01 className="size-5" />}
                </button>
            </header>

            {/* slide */}
            <main className="flex min-h-0 flex-1 items-center justify-center px-5 pb-4">
                <div key={index} className="deck-slide flex max-h-full w-full max-w-3xl flex-col overflow-y-auto px-1 py-2">
                    <div className="prose">
                        <Markdown remarkPlugins={[remarkGfm]} components={components}>
                            {slide.md}
                        </Markdown>
                    </div>
                </div>
            </main>

            {/* bottom controls */}
            <footer className="flex h-16 shrink-0 items-center justify-between gap-4 px-5">
                <button
                    type="button"
                    onClick={prev}
                    disabled={index === 0}
                    aria-label="Previous slide"
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-primary bg-primary text-fg-quaternary shadow-xs transition duration-150 ease-out hover:bg-primary_hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ArrowLeft className="size-5" />
                </button>

                <div className="flex flex-1 items-center justify-center gap-1.5">
                    {SLIDES.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to ${s.section} slide ${i + 1}`}
                            aria-current={i === index}
                            className={
                                i === index
                                    ? "h-1.5 w-6 rounded-full bg-brand-solid transition-all duration-200 ease-out"
                                    : "h-1.5 w-1.5 rounded-full bg-quaternary transition-all duration-200 ease-out hover:bg-tertiary"
                            }
                        />
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm tabular-nums text-tertiary">
                        {index + 1} / {total}
                    </span>
                    <button
                        type="button"
                        onClick={next}
                        disabled={index === total - 1}
                        aria-label="Next slide"
                        className="inline-flex size-10 items-center justify-center rounded-lg border border-primary bg-primary text-fg-quaternary shadow-xs transition duration-150 ease-out hover:bg-primary_hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowRight className="size-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
