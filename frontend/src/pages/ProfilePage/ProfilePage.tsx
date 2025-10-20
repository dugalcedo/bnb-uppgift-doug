import './ProfilePage.css'
import { useAppContext } from "../../context/AppContext.tsx";
import BookingsList from "./BookingsList.tsx";
import PropertyList from "./PropertyList.tsx"
import useModal from "../../util/useModal.tsx";
import AddPropertyModal from "./AddPropertyModal.tsx";

function ProfilePage() {

    const app = useAppContext()
    const addPropertyModal = useModal({ component: AddPropertyModal })

    if (!app.user) return (
        <div className="responsive">
            <p>You must be logged in to view this page.</p>
        </div>
    )

    return (
        <section className="page profile-page responsive">

            <div className="bookings">
                <h2>Your bookings</h2>
                {!app.user.bookings.length ? (
                    <p>You don't have any bookings.</p>
                ) : <BookingsList user={app.user} />}
            </div>

            <div className="properties">
                <h2>Your properties</h2>
                <button className='add-property-btn' onClick={addPropertyModal.open}>Add property</button>
                <addPropertyModal.component />
                {!app.user.properties.length ? (
                    <p>You don't have any properties.</p>
                ): <PropertyList user={app.user} />} 
            </div>

        </section>
    )
}

export default ProfilePage;