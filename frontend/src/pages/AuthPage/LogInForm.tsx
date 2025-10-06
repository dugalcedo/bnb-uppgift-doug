import type { FormEventHandler } from "react"
import FormField from "../../components/util/FormField.tsx";
import useAuthFormData from "../../util/useAuthFormData.ts"
import { backendFetch } from "../../util/backendFetch.ts"

function LogInForm() {

    const { formData, formError, setFormError, errors, valid, handleChange } = useAuthFormData(false)

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (!valid) return;

        const { res, data } = await backendFetch<AuthFormData, User>(
            "/api/user/login",
            { method: "POST" },
            formData
        )

        if (!res.ok) {
            setFormError(data.message)
            return
        }

        if (data.token) localStorage.setItem('dugbnb-token', data.token);
        window.location.href = "/"
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormField label="Name" error={errors.name}>
                <input type="text" placeholder="Enter your name" defaultValue={formData.name} onChange={handleChange('name')} />
            </FormField>
            <FormField label="Password" error={errors.password}>
                <input type="password" name="password" defaultValue={formData.password} onChange={handleChange('password')} />
            </FormField>

            <button disabled={!valid}>Log in</button>
            {formError && <span className="error">{formError}</span>}
            {!valid && <span>!</span>}
        </form>
    )
}

export default LogInForm;