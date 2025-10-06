import type { ChangeEventHandler } from "react"
import { useState } from "react";
import useLocalStorage from "./useLocalStorage.ts"

const defaultAuthFormData: AuthFormData = {
    name: "",
    email: "",
    password: "",
    password2: ""
}

export default function useAuthFormData(signingUp: boolean) {
    const [formData, setFormData] = useLocalStorage<AuthFormData>('dugbnb-authFormData', defaultAuthFormData);
    const [formError, setFormError] = useState('');

    const errors = (() => {
        const errors: Partial<AuthFormData> = {}

        if (!formData.name.trim()) errors.name = "Required";
        if (!formData.password.trim()) errors.password = "Required";

        if (signingUp) {
            if (!formData.email.trim()) errors.email = "Required"
            if (!formData.password2.trim()) errors.password2 = "Required"
            if (formData.password !== formData.password2) errors.password2 = "Passwords must match"
        }

        return errors
    })();

    const handleChange = (key: keyof AuthFormData) => {
        setFormError('')
        const handler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
            setFormData({...formData, [key]: e.currentTarget.value })
        }
        return handler
    }

    return {
        formData,
        formError,
        setFormError,
        errors,
        valid: Object.keys(errors).length === 0 && formError === '',
        handleChange
    }
}