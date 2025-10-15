import { type RefObject } from "react";

const listenerMap = new Map<RefObject<HTMLElement | null>, boolean>()

export default function useClickOutside(nodeRef: RefObject<HTMLElement | null>, fn: Function) {
    if (!nodeRef.current) return;   
    if (listenerMap.get(nodeRef)) return;

    document.addEventListener('click', e => {
        if (!nodeRef.current) return;
        if (e.target === nodeRef.current) return;
        if (nodeRef.current.contains(e.target as Node)) return;
        fn()
    })

    listenerMap.set(nodeRef, true)
}