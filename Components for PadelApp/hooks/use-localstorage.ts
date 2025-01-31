import React, { useCallback } from "react";
import type { z } from "zod";

export const useLocalStorage = <T extends z.ZodSchema = z.ZodSchema>(key: string, schema: T) => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const memoSchema = React.useMemo(() => schema, []);
    const setSidebarState = useCallback(
        (newValue: z.infer<T>) => {
            window.localStorage.setItem(key, JSON.stringify(newValue));
            window.dispatchEvent(new StorageEvent("storage", { key: key, newValue }));
        },
        [key],
    );

    const getSnapshot = useCallback(() => {
        const item = localStorage.getItem(key);
        const value = item ? JSON.parse(item) : null;
        const parsedValue = memoSchema.parse(value) as z.infer<T>;
        return parsedValue;
    }, [key, memoSchema]);

    const subscribe = useCallback((listener: () => void) => {
        window.addEventListener("storage", listener);
        return () => void window.removeEventListener("storage", listener);
    }, []);

    const store = React.useSyncExternalStore(subscribe, getSnapshot);

    return [store, setSidebarState] as const;
};
