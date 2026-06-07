import { useCallback, useEffect, useState } from "react";
import type { AppliedFilter } from "./filtering";

export interface SavedView {
    id: string;
    name: string;
    filters: AppliedFilter[];
}

/**
 * Persisted, named filter sets (plan.md §2c "Save as view").
 * Storage: localStorage. Keyed per surface so different tables don't collide.
 */
export function useSavedViews(storageKey: string) {
    const [views, setViews] = useState<SavedView[]>(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? (JSON.parse(raw) as SavedView[]) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(views));
        } catch {
            /* ignore quota/availability errors */
        }
    }, [storageKey, views]);

    const save = useCallback((name: string, filters: AppliedFilter[]) => {
        const id = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        setViews((v) => [...v, { id, name: name.trim(), filters }]);
    }, []);

    const remove = useCallback((id: string) => setViews((v) => v.filter((x) => x.id !== id)), []);

    return { views, save, remove };
}
