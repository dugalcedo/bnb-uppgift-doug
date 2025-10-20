import './modal.css'
import type { ReactNode } from "react"
import { useState, useRef } from "react"

type ModalInit<PropType extends Record<string, any> = {}> = {
    component: (props: PropType) => ReactNode
}

export default function useModal<PropType extends Record<string, any> = {}>(modalInit: ModalInit<PropType>) {

    const busyRef = useRef(false)
    const backdropRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(false)

    const lockWhile = (ms: number, cb: Function) => {
        // check lock
        if (busyRef.current) {
            console.warn("Modal busy.")
            return
        };

        // lock
        busyRef.current = true

        cb()

        // unlock
        setTimeout(() => {
            busyRef.current = false
        }, ms);
    }
    

    const open = () => lockWhile(510, () => {
        // activate
        setActive(true)

        // fade in backdrop
        setTimeout(() => {
            backdropRef.current!.style.opacity = "1"
        }, 10);

        // zoom in window
        setTimeout(() => {
            windowRef.current!.style.transform = "scale(1)"
        }, 260);
    })

    const close = () => lockWhile(510, () => {
        // hide window
        windowRef.current!.style.transform = "scale(0)"

        // fade out backdrop
        setTimeout(() => {
            backdropRef.current!.style.opacity = "0"
        }, 250);

        // deactivate
        setTimeout(() => {
            setActive(false)
        }, 260);
    })

    const component = (props: PropType) => {

        if (!active) return <></>

        return (
            <div className="modal-backdrop" style={{opacity: 0}} ref={backdropRef} onClick={e => {
                if (e.target !== e.currentTarget) return;
                close()
            }}>
                <div className="modal-window" style={{transform: "scale(0)"}} ref={windowRef}>
                    <button className="modal-x" onClick={close}>&times;</button>
                    {/* I'm trying to pass the props into this component */}
                    {modalInit.component(props)}
                </div>
            </div>
        )
    }

    return {
        component,
        open,
        close
    }
}