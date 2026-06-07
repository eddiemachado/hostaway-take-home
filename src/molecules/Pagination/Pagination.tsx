import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { Button } from "@/atoms/Button";
import { cx } from "@/utils/cx";

export interface PaginationProps {
    /** 1-based current page. */
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    className?: string;
}

/** Build a compact page list with ellipses, e.g. [1, "…", 4, 5, 6, "…", 20]. */
function pageList(page: number, pageCount: number): (number | "…")[] {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(pageCount - 1, page + 1);
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < pageCount - 1) pages.push("…");
    pages.push(pageCount);
    return pages;
}

/** Numbered pagination with prev/next. */
export const Pagination = ({ page, pageCount, onPageChange, className }: PaginationProps) => {
    if (pageCount <= 1) return null;

    return (
        <nav aria-label="Pagination" className={cx("flex items-center justify-between gap-2", className)}>
            <Button variant="secondary" size="sm" iconLeading={ArrowLeft} isDisabled={page <= 1} onPress={() => onPageChange(page - 1)}>
                Previous
            </Button>

            <ul className="flex items-center gap-0.5">
                {pageList(page, pageCount).map((p, i) =>
                    p === "…" ? (
                        <li key={`gap-${i}`} className="px-2 text-sm text-quaternary" aria-hidden="true">
                            …
                        </li>
                    ) : (
                        <li key={p}>
                            <button
                                type="button"
                                onClick={() => onPageChange(p)}
                                aria-current={p === page ? "page" : undefined}
                                className={cx(
                                    "flex size-10 cursor-pointer items-center justify-center rounded-lg text-sm font-medium outline-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                                    p === page ? "bg-secondary text-secondary" : "text-tertiary hover:bg-primary_hover",
                                )}
                            >
                                {p}
                            </button>
                        </li>
                    ),
                )}
            </ul>

            <Button variant="secondary" size="sm" iconTrailing={ArrowRight} isDisabled={page >= pageCount} onPress={() => onPageChange(page + 1)}>
                Next
            </Button>
        </nav>
    );
};
