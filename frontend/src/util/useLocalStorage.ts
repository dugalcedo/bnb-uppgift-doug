import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

export default function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [data, setData] = useState<T>(() => {
        let str = localStorage.getItem(key)
        if (!str) return defaultValue;
        try {
            return JSON.parse(str)
        } catch {
            return defaultValue;
        }
    })

    // update on change
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(data))
    }, [data])

    return [data, setData]
}