import useLocalStorage from "../../util/useLocalStorage.ts";
import FormField from "../../components/util/FormField.tsx";
import type { FormEventHandler } from "react"
import { backendFetch } from "../../util/backendFetch.ts"
import { useToastContext } from "../../context/ToastContext.tsx"
import { useAppContext } from "../../context/AppContext.tsx"

type AddPropertyFormData = {
    name: string
    description: string
    city: string
    state: string
    country: string
    pricePerNight: number
    image: string
}

function AddPropertyModal() {

    const toast = useToastContext()
    const app = useAppContext()

    const [formData, setFormData] = useLocalStorage<AddPropertyFormData>('dugbnb-addpropertyform', {
        name: "",
        description: "",
        city: "",
        state: "",
        country: "",
        pricePerNight: 0,
        image: ""
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        const { res, data } = await backendFetch(
            `/api/property`,
            { method: 'POST' },
            {
                ...formData,
                userId: app.user?._id
            }
        )

        if (!res.ok) {
            toast.openToast(data.message, 'maroon')
            return
        }

        alert("Success")
        window.location.reload()
    }

    return (
        <>
            <div className="head">
                <h2>Add property</h2>
            </div>
            <div className="body">
                <form onSubmit={handleSubmit}>
                    <FormField label="Street address">
                        <input type="text" 
                            defaultValue={formData.name}
                            onChange={e => setFormData(d => ({...d, name: e.target.value}))}
                        />
                    </FormField>
                    <FormField label="City">
                        <input type="text" 
                            defaultValue={formData.city}
                            onChange={e => setFormData(d => ({...d, city: e.target.value}))}
                        />
                    </FormField>
                    <FormField label="State">
                        <input type="text" 
                            defaultValue={formData.state}
                            onChange={e => setFormData(d => ({...d, state: e.target.value}))}
                        />
                    </FormField>
                    <FormField label="Country">
                        <input type="text" 
                            defaultValue={formData.country}
                            onChange={e => setFormData(d => ({...d, country: e.target.value}))}
                        />
                    </FormField>
                    <FormField label="Image URL">
                        <input type="text" 
                            defaultValue={formData.image}
                            onChange={e => setFormData(d => ({...d, image: e.target.value}))}
                        />
                    </FormField>
                    <FormField label="Description">
                        <textarea
                            defaultValue={formData.description}
                            onChange={e => setFormData(d => ({...d, description: e.target.value}))}
                        ></textarea>
                    </FormField>
                    <FormField label="Price per night">
                        <input type="number" 
                            defaultValue={formData.pricePerNight}
                            onChange={e => setFormData(d => ({...d, pricePerNight: Number(e.target.value) || 0}))}
                        />
                    </FormField>
                    <button>Submit</button>
                </form>
            </div>
        </>
    )
}

export default AddPropertyModal;