import dayjs, { type Dayjs } from "dayjs";
import { backendFetch } from "../../util/backendFetch.ts"
import { useToastContext } from "../../context/ToastContext.tsx";


function BookingsList({ user }: { user: User }) {

    const toast = useToastContext()

    const unbook = async (bookingId: string) => {
        const { res, data } = await backendFetch(
            "/api/booking",
            { method: "DELETE" },
            { userId: user._id, bookingId }
        )

        if (!res.ok) {
            toast.openToast(data.message, 'maroon')
            return
        }

        alert("Booking deleted")
        window.location.reload()
    }

    return (
        <ul className="bookings-list">
            {user.bookings.map(booking => {
                const checkInD = dayjs(booking.checkInDate)
                const checkOutD = dayjs(booking.checkOutDate)
                const f = (d: Dayjs) => d.format("ddd, MMM d YYYY")
                const numberOfNights = checkOutD.diff(checkInD, 'day')

                return (
                    <li key={booking._id}>
                        <h3 className="title">{booking.property.name}</h3>
                        <div className="dates">
                            <p>{numberOfNights} nights</p>
                            <p>Check in: {f(checkInD)}</p>
                            <p>Check out: {f(checkOutD)}</p>
                        </div>
                        <div className="controls">
                            <button className="del" onClick={() => unbook(booking._id)}>
                                Unbook
                            </button>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default BookingsList;
