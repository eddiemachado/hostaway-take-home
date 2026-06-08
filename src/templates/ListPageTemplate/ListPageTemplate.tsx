import { useCallback, useRef, useState, type ReactNode } from "react";
import { SiteHeader } from "@/shared/SiteHeader";

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

/**
 * List-page layout. Chrome is just the shared SiteHeader (for navigating to the deck); the rest
 * of the screen is the focused content container — page header, toolbar, filters, table,
 * pagination. No app sidebar/topbar: this exercise is about the table + filters.
 */
export const ListPageTemplate = ({ header, toolbar, filters, children, footer }: ListPageTemplateProps) => {
    const scrollRef = useRef<HTMLElement>(null);
    const [elevated, setElevated] = useState(false);
    const onScroll = useCallback(() => {
        const el = scrollRef.current;
        if (el) setElevated(el.scrollTop > 2);
    }, []);

    return (
        <div className="flex h-screen flex-col bg-secondary">
            <SiteHeader current="reservations" elevated={elevated} />
            <main ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-auto">
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
    );
};
