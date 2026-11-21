"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "./api";

// Small data hook for dashboard pages: loads a private API path and exposes reload()
export function useApi<T>(path: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [version, setVersion] = useState(0);
    const [loadedKey, setLoadedKey] = useState<string | null>(null);

    // show the loader again whenever the path (e.g. a filter) changes
    const key = `${path}#${version}`;
    if (path && loadedKey !== key && !loading) setLoading(true);

    useEffect(() => {
        if (!path) return;
        let cancelled = false;
        api<T>(path)
            .then((d) => {
                if (cancelled) return;
                setData(d);
                setError(null);
            })
            .catch((err) => !cancelled && setError(errorMessage(err)))
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
                setLoadedKey(key);
            });
        return () => {
            cancelled = true;
        };
    }, [path, key]);

    const reload = useCallback(() => setVersion((v) => v + 1), []);

    return { data, loading, error, reload, setData };
}