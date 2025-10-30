import './AdminPage.css'

import { useAppContext } from "../../context/AppContext.tsx";
import dayjs from "dayjs";
import useAdmin from "./useAdmin.ts"
const fBooking = (str: string) => dayjs(str).format("ddd, MMM d YYYY");


function AdminPage() {

    const app = useAppContext()
    const admin = useAdmin()

    if (!app.user?.isAdmin) return (
        <div className="responsive">Unauthorized</div>
    )

    if (admin.loading) return (
        <div className="responsive">Loading...</div>
    )

    if (admin.error) return (
        <div className="responsive">Error: {admin.error}</div>
    )

    if (!admin.data.data) return (
        <div className="responsive">Error: No admin data</div>
    )

    const { properties, bookings } = admin.data.data;

    return (
        <section className="page admin-page responsive">
            <h2>Admin panel</h2>

            <div className="grid">
                <div>
                    <h3>Properties</h3>
                    {properties.map(p => {
                        return <div className="property" key={p._id}>
                            <h4>{p.name}</h4>
                            <button onClick={() => admin.deleteProperty(p)}>DELETE</button>
                        </div>
                    })}
                </div>
                <div>
                    <h3>Bookings</h3>
                    {bookings.map(b => {
                        const p = properties.find(p => p._id === b.propertyId)
                        return <div className="booking" key={b._id}>
                            <h4>{p?.name}</h4>
                            <p>Check in: {fBooking(b.checkInDate)}</p>
                            <p>Check out: {fBooking(b.checkOutDate)}</p>
                            <button onClick={() => admin.deleteBooking(b)}>CANCEL</button>
                        </div>
                    })}
                </div>
            </div>

        </section>
    )
}

export default AdminPage;