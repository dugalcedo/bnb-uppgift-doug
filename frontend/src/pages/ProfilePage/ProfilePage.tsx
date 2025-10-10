import { useAppContext } from "../../context/AppContext.tsx";
import BookingsList from "./BookingsList.tsx";

function ProfilePage() {

    const app = useAppContext()

    if (!app.user) return (
        <div className="responsive">
            <p>You must be logged in to view this page.</p>
        </div>
    )

    return (
        <section className="page profile-page responsive">
            <h2>Your bookings</h2>
            {!app.user.bookings.length ? (
                <p>You don't have any bookings.</p>
            ) : <BookingsList user={app.user} />}
        </section>
    )
}

export default ProfilePage;