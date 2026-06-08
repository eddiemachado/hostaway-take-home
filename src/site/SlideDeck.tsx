import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const ROADMAP_TITLE = roadmapContent.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Roadmap";

type Slide = { kind: "title" } | { kind: "overview" } | { kind: "wrapup" } | { kind: "md"; section: "Audit" | "Roadmap"; md: string };
const SLIDES: Slide[] = [
    { kind: "title" },
    ...AUDIT_SLIDES.map((md) => ({ kind: "md" as const, section: "Audit" as const, md })),
    { kind: "overview" },
    ...ROADMAP_SLIDES.map((md) => ({ kind: "md" as const, section: "Roadmap" as const, md })),
    { kind: "wrapup" },
];

/** Phases that carry a `Month:` — drives the overview timeline (title + month from the doc). */
const PHASES = ROADMAP_SLIDES.map((md) => ({
    title: md.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim() ?? "",
    month: md.match(/\*\*Month:\*\*\s*(.+)/)?.[1]?.trim() ?? null,
})).filter((p): p is { title: string; month: string } => p.month != null);

/** Read a paragraph's leading `**Label:**` (e.g. "Month:", "Goal:", "Milestone:") if present. */
function leadingStrongLabel(node: unknown): string {
    const n = node as { children?: Array<{ type?: string; tagName?: string; children?: Array<{ type?: string; value?: string }> }> };
    const first = n?.children?.[0];
    if (first?.type === "element" && first.tagName === "strong") {
        const text = first.children?.[0];
        if (text?.type === "text") return text.value ?? "";
    }
    return "";
}

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

/** Roadmap-only renderers: tag Month / Goal / Milestone paragraphs so CSS can style the timeline. */
function makeRoadmapComponents(base: Components): Components {
    return {
        ...base,
        p({ node, children }) {
            const label = leadingStrongLabel(node);
            if (label === "Month:") return <p className="rm-month">{children}</p>;
            if (label === "Goal:") return <p className="rm-goal">{children}</p>;
            if (label === "Milestone:") return <p className="rm-milestone">{children}</p>;
            return <p>{children}</p>;
        },
    };
}

/** Metrics slide: split each "**Label** — description" into a block label + smaller description. */
function makeMetricsComponents(base: Components): Components {
    return {
        ...base,
        li({ children }) {
            const items = Children.toArray(children);
            const label = items[0];
            const rest = items.slice(1).map((c, i) => (i === 0 && typeof c === "string" ? c.replace(/^\s*[—–-]\s*/, "") : c));
            return (
                <li>
                    <span className="metric-label">{label}</span>
                    <span className="metric-desc">{rest}</span>
                </li>
            );
        },
    };
}

/** At-a-glance horizontal timeline of the phased months (overview slide). */
function RoadmapOverview() {
    return (
        <div className="py-6">
            <h2 className="mb-10 text-display-sm font-semibold text-primary">{ROADMAP_TITLE}</h2>
            <div className="relative flex justify-between gap-3">
                <div className="absolute inset-x-3 top-3 h-0.5 bg-border-secondary" aria-hidden="true" />
                {PHASES.map((p, i) => (
                    <div key={p.title} className="relative flex flex-1 flex-col items-start gap-2">
                        <span className="z-10 flex size-6 items-center justify-center rounded-full bg-brand-solid text-xs font-bold text-white ring-4 ring-[var(--color-bg-primary)]">
                            {i + 1}
                        </span>
                        <span className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">Month {p.month}</span>
                        <span className="text-sm font-medium text-primary">{p.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Closing summary of the whole presentation (audit → system → roadmap). */
function WrapUp() {
    const cards = [
        { k: "The problem", v: "Untitled UI got us moving fast, but it isn't a system yet — no single source of truth, no owned docs, and Tailwind leaves no clear answer." },
        { k: "The approach", v: "Own the foundations as tokens, keep a simple vocabulary (Foundations · Components · Patterns · Templates), and write docs for humans and AI so change propagates." },
        { k: "The plan", v: "Audit → foundations & tokens → build components & patterns → migration & governance, with agents and workflows keeping us aligned as we build." },
    ];
    return (
        <div className="py-6">
            <h2 className="mb-3 text-display-sm font-semibold text-primary">Wrapping up</h2>
            <p className="mb-8 max-w-2xl text-lg text-tertiary">
                The goal isn't to throw away Untitled UI — it's to make it ours: a system that feels like Hostaway and scales.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
                {cards.map((c) => (
                    <div key={c.k} className="rounded-xl border border-secondary bg-secondary p-5">
                        <h3 className="mb-2 text-xs font-semibold tracking-wide text-brand-secondary uppercase">{c.k}</h3>
                        <p className="text-sm text-tertiary">{c.v}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-secondary p-5">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-solid" aria-hidden="true" />
                <p className="text-md font-medium text-primary">
                    The outcome: a token-driven, AI-enabled, documented system — restyled by changing tokens, not code.
                </p>
            </div>
            <p className="mt-8 text-md text-tertiary">Thanks for reading — happy to dig into any part of this.</p>
        </div>
    );
}

export function SlideDeck() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const [index, setIndex] = useState(0);
    const total = SLIDES.length;
    const components = useMemo(() => makeComponents(isDark), [isDark]);
    const roadmapComponents = useMemo(() => makeRoadmapComponents(components), [components]);
    const metricsComponents = useMemo(() => makeMetricsComponents(roadmapComponents), [roadmapComponents]);

    // Scroll-edge shadows: show the top border/shadow only once scrolled down, and the bottom
    // only while more content remains below (i.e. the slide actually overflows).
    const scrollRef = useRef<HTMLDivElement>(null);
    const [edges, setEdges] = useState({ top: false, bottom: false });
    const updateEdges = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const top = el.scrollTop > 2;
        const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
        setEdges((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
    }, []);

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

    // Recompute edges when the slide changes (content height differs) and on resize.
    useEffect(() => {
        const id = requestAnimationFrame(updateEdges);
        window.addEventListener("resize", updateEdges);
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener("resize", updateEdges);
        };
    }, [index, updateEdges]);

    const slide = SLIDES[index];
    const progress = ((index + 1) / total) * 100;

    return (
        <div className="flex h-screen flex-col bg-primary">
            {/* progress */}
            <div className="h-0.5 w-full bg-transparent">
                <div className="h-full bg-brand-solid transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} aria-hidden="true" />
            </div>

            {/* top chrome */}
            <header
                className={`z-10 flex h-14 shrink-0 items-center justify-between bg-primary px-5 transition-shadow duration-200 ${
                    edges.top ? "border-b border-secondary shadow-[0_8px_16px_-12px_rgba(10,13,18,0.12)]" : "border-b border-transparent"
                }`}
            >
                <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-brand-solid text-sm font-bold text-white" aria-hidden="true">H</span>
                    {slide.kind !== "title" && (
                        <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">
                            {slide.kind === "overview" ? "Roadmap" : slide.kind === "wrapup" ? "Wrap-up" : slide.section}
                        </span>
                    )}
                </div>
                <nav className="flex items-center gap-1.5">
                    <a
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-secondary transition duration-150 ease-out hover:bg-primary_hover active:scale-95"
                    >
                        Reservations
                    </a>
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

            {/* slide */}
            <main className="flex min-h-0 flex-1 items-center justify-center px-5 pb-4">
                <div
                    key={index}
                    ref={scrollRef}
                    onScroll={updateEdges}
                    className="deck-slide flex max-h-full w-full max-w-3xl flex-col overflow-y-auto px-1 py-2"
                >
                    {slide.kind === "title" ? (
                        <div className="py-10">
                            <h1 className="text-display-2xl font-semibold leading-tight text-primary">Eddie Machado</h1>
                            <p className="mt-4 text-xl text-tertiary">Staff designer - Design systems</p>
                        </div>
                    ) : slide.kind === "overview" ? (
                        <RoadmapOverview />
                    ) : slide.kind === "wrapup" ? (
                        <WrapUp />
                    ) : (
                        (() => {
                            if (slide.section !== "Roadmap") {
                                return (
                                    <div className="prose">
                                        <Markdown remarkPlugins={[remarkGfm]} components={components}>
                                            {slide.md}
                                        </Markdown>
                                    </div>
                                );
                            }
                            const isPhase = /\*\*Month:\*\*/.test(slide.md);
                            const isMetrics = /measure success/i.test(slide.md);
                            return (
                                <div className={`prose roadmap-prose${isPhase ? " phase" : ""}${isMetrics ? " metrics" : ""}`}>
                                    <Markdown remarkPlugins={[remarkGfm]} components={isMetrics ? metricsComponents : roadmapComponents}>
                                        {slide.md}
                                    </Markdown>
                                </div>
                            );
                        })()
                    )}
                </div>
            </main>

            {/* bottom controls */}
            <footer
                className={`z-10 flex h-16 shrink-0 items-center justify-between gap-4 bg-primary px-5 transition-shadow duration-200 ${
                    edges.bottom ? "border-t border-secondary shadow-[0_-8px_16px_-12px_rgba(10,13,18,0.12)]" : "border-t border-transparent"
                }`}
            >
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
                    {SLIDES.map((_s, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
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
