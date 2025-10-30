import './ManagePage.css'
import { useAppContext } from "../../context/AppContext.tsx"
import { useParams } from "react-router-dom"
import { useBackendFetchOnFirstMount } from "../../util/backendFetch.ts"
import SingleBookingManager from "./SingleBookingManager.tsx"

function ManagePage() {

    const { id: propertyId = "" } = useParams()

    const app = useAppContext()

    const property = app?.user?.properties.find(pr => pr._id == propertyId)

    const bookingsFetch = useBackendFetchOnFirstMount<{}, Booking[]>(`/api/booking/byPropertyId/${propertyId}`)

    return (
        <section className="page manage-page responsive">
            {bookingsFetch.loading ? <>
                {/* LOADING */}
                <p>Loading...</p>
            </> : bookingsFetch.error ? <>
                {/* ERROR */}
                <p className="error">Error: {bookingsFetch.error}</p>
            </> : !property ? <>
                {/* MISSING PROPERTY */}
                <p className="error">Error: property not found</p>
            </> : !app.user ? <>
                {/* NOT LOGGED IN */}
                <p>You must be logged in</p>
            </> : (!app.user.isAdmin && (property.userId !== app.user._id)) ? <>
                {/* NOT AUTHORIZED */}
                <p className="error">Error: You are not authorized to manage this property's bookings</p>
            </> : !bookingsFetch.data?.data?.length ? <>
                <p className="error">Error: No bookings found</p>
            </> : <>
                <h3>Managing bookings for property: {property.name}</h3>
                <div className="manage-page-bookings">
                    {bookingsFetch.data.data.map(b => {
                        return <SingleBookingManager booking={b} key={b._id} />
                    })}
                </div>
            </>}
        </section>
    )
}

export default ManagePage;