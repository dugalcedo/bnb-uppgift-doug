import { useToastContext } from "../../context/ToastContext.tsx"
import { backendFetch } from "../../util/backendFetch.ts"

type PropertyListProps = {
    user: User
}

function PropertyList({ user }: PropertyListProps) {

    const toast = useToastContext()

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

    return (
        <ul className="property-list">
            {user.properties.map(p => {
                return <li key={p._id}>
                    <h3>{p.name}</h3>
                    <p>{p.city}, {p.state}, {p.country}</p>
                    <p>{p.latitude} / {p.longitude}</p>
                    <button onClick={() => handleDelete(p)}>Delete</button>
                </li>
            })}
        </ul>
    )
}

export default PropertyList;