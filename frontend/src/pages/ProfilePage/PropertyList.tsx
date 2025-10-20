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
                                <button className="edit">Edit</button>
                            </div>
                        </div>
                    </div>
                </li>
            })}
        </ul>
    )
}

export default PropertyList;