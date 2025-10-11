import { useAppContext } from "../../context/AppContext.tsx";
import { useBackendFetchOnFirstMount } from "../../util/backendFetch.ts"
import dayjs from "dayjs";
const fBooking = (str: string) => dayjs(str).format("ddd, MMM d YYYY");

type AdminPanelData = {
    properties: Property[]
    bookings: Booking[]
}

function AdminPage() {

    const app = useAppContext()
    const { data, loading, error } = useBackendFetchOnFirstMount<{}, AdminPanelData>('/api/admin')

    if (!app.user?.isAdmin) return (
        <div className="responsive">Unauthorized</div>
    )

    if (loading) return (
        <div className="responsive">Loading...</div>
    )

    if (error) return (
        <div className="responsive">Error: {error}</div>
    )

    return (
        <section className="page admin-page">
            <h2>Admin panel</h2>

            <div>
                <h3>Properties</h3>
                {data.data?.properties.map(p => {
                    return <div className="property" key={p._id}>
                        <h4>{p.name}</h4>
                        <button>DELETE</button>
                    </div>
                })}
            </div>

            <div>
                <h3>Bookings</h3>
                {data.data?.bookings.map(b => {
                    const p = data.data?.properties.find(p => p._id === b.propertyId)
                    return <div className="booking" key={b._id}>
                        <h4>{p?.name}</h4>
                        <p>Check in: {fBooking(b.checkInDate)}</p>
                        <p>Check out: {fBooking(b.checkOutDate)}</p>
                        <button>CANCEL</button>
                    </div>
                })}
            </div>

        </section>
    )
}

export default AdminPage;