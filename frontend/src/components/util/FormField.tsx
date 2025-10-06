import { type ReactNode, useId, useRef, useEffect } from "react"

type FormFieldProps = {
    children: ReactNode
    label?: string
    autoLabel?: boolean
    error?: string
}

function FormField({ 
    children,
    label,
    autoLabel = true,
    error
 }: FormFieldProps) {

    const id = useId()
    const inputContainerRef = useRef<HTMLDivElement>(null)

    // Apply label
    useEffect(() => {
        if (!autoLabel) return;
        if (!label) return;
        if (!inputContainerRef.current) return;
        const input = inputContainerRef.current.querySelector(":scope input, select, textarea")
        if (!input) return;
        input.id = id;
    })

    return (
        <div className="field" style={{ gridTemplateColumns: label ? "1fr 1fr" : "1fr" }}>
            {label && (
                <label htmlFor={id}>{label}</label>
            )}
            <div className="input-container" ref={inputContainerRef}>
                {children}
            </div>
            {error && <span className="error">{error}</span>}
        </div>
    )
}

export default FormField;