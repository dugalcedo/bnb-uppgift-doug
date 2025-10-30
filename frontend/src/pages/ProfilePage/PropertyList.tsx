import FormField from "../../components/util/FormField.tsx"
import LoadingWheel from "../../components/util/LoadingWheel.tsx"
import { useToastContext } from "../../context/ToastContext.tsx"
import { backendFetch } from "../../util/backendFetch.ts"
import useModal from "../../util/useModal.tsx"
import { useState, useTransition, type FormEventHandler } from "react"
import { Link } from "react-router-dom"

type PropertyListProps = {
    user: User
}

type EditPropertyModalProps = {
    user: User
    property: Property | null
    close: Function
}

function PropertyList({ user }: PropertyListProps) {

    const toast = useToastContext()
    const editPropertyModal = useModal<EditPropertyModalProps>({ component: EditPropertyModal })
    const [selectedProperty, setSelectedProperty] = useState<null | Property>(null)

    const handleDelete = async (p: Property) => {
        const { res, data } = await backendFetch(
            `/api/property`,
            { method: "DELETE" },
            { propertyId: p._id, userId: user._id }
        )

        if (!res.ok) {
            toast.openToast(data.message, 'maroon')
            return
        }

        window.location.reload()
    }

    const handleEdit = (p: Property) => {
        setSelectedProperty(p)
        editPropertyModal.open()
    }

    return (
        <>
            <editPropertyModal.component user={user} property={selectedProperty} close={editPropertyModal.close} />        
            <ul className="property-list">
                {user.properties.map(p => {
                    const shortDesc = p.description.length <= 50 ? p.description : (p.description.slice(0, 50) + '...')

                    return <li key={p._id} className="property-list-item">
                        <div className="img-info">
                            <img src={p.image} />
                            <div className="info">
                                <h3>{p.name}</h3>
                                <p className="desc">{shortDesc}</p>
                                <p>{p.city}, {p.state}, {p.country}</p>
                                <p className="price">${p.pricePerNight}</p>
                                <div className="controls">
                                    <button className="del" onClick={() => handleDelete(p)}>Delete</button>
                                    <button className="edit" onClick={() => handleEdit(p)}>Edit</button>
                                    {(p.bookingCount||0) > 0 && (
                                        <Link to={`/manage/${p._id}`}>
                                            <button className="manage">Manage bookings</button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                })}
            </ul>
        </>
    )
}

export default PropertyList;

//// Edit Property modal

const EditPropertyModal = ({ user, property }: EditPropertyModalProps) => {

    const toast = useToastContext()

    const [formData, setFormData] = useState({
        name: property?.name || "",
        description: property?.description || "",
        city: property?.city || "",
        state: property?.state || "",
        country: property?.country || "",
        pricePerNight: property?.pricePerNight || 0,
        image: property?.image || ""
    })
    const [submitting, startSubmission] = useTransition()

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (submitting) return;

        startSubmission(async () => {
            const { res, data } = await backendFetch(
                `/api/property`,
                { method: 'PUT' },
                {
                    ...formData,
                    userId: user._id,
                    propertyId: property?._id
                }
            )

            if (!res.ok) {
                toast.openToast(data.message, 'maroon')
                return
            }

            alert("Success")
            window.location.reload()
        })
    }

    return (
        <>
            <div className="head">
                <h2>Edit property</h2>
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
                    <button disabled={submitting}>
                        {submitting ? <LoadingWheel /> : "Submit"}
                    </button>
                </form>
            </div>
        </>
    )
}