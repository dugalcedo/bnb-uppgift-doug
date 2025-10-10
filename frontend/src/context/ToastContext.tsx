import "./Toast.css"
import { createContext, useContext, useState, useRef, type ReactNode } from "react";

type ToastContext = {
    text: string
    openToast: (text: string, bg?: string) => void
    closeToast: () => void
}

const initialToastContext: ToastContext = {
    text: "",
    openToast: () => {},
    closeToast: () => {}
}

const Context = createContext(initialToastContext)

export const useToastContext = () => useContext(Context);

const ANIMATION_DUR = 500;
const SHOWN_DUR = 8000;

export const ToastContextProvider = ({ children }: { children: ReactNode }) => {

    const [text, setText] = useState("")
    const [shown, setShown] = useState(false)
    const [bgColor, setBgColor] = useState("gray")
    const unshowTimeoutRef = useRef<undefined | number>(undefined)
    const deleteTextRef = useRef<undefined | number>(undefined)

    const clearAllTimeouts = () => {
        clearTimeout(deleteTextRef.current)
        clearTimeout(unshowTimeoutRef.current)
    }

    const openToast = (msg: string, bg?: string) => {
        clearAllTimeouts()

        setText(msg)
        setBgColor(bg || "gray")
        setShown(true)

        unshowTimeoutRef.current = setTimeout(() => {
            setShown(false)
        }, ANIMATION_DUR + SHOWN_DUR);

        deleteTextRef.current = setTimeout(() => {
            setBgColor('gray')
            setText('')
        }, ANIMATION_DUR + SHOWN_DUR + ANIMATION_DUR);
    }

    const closeToast = () => {
        clearAllTimeouts()

        setShown(false)

        deleteTextRef.current = setTimeout(() => {
            setBgColor('gray')
            setText('')
        }, ANIMATION_DUR);
    }

    const ctx: ToastContext = {
        text,
        openToast,
        closeToast
    }

    return <Context.Provider value={ctx}>
        <div id="toast" style={{
            transform: `translateY(${shown ? "25px" : "-110%"}) translateX(-50%)`,
            transition: `transform ${ANIMATION_DUR}ms`,
            backgroundColor: bgColor
        }}>
            <div className="left">
                <p>{text}</p>
            </div>
            <div className="right">
                <button className="x" onClick={closeToast}>&times;</button>
            </div>
        </div>
        {children}
    </Context.Provider>
}
