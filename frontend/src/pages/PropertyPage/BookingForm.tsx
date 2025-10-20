import { useAppContext } from "../../context/AppContext.tsx"
import { useToastContext } from "../../context/ToastContext.tsx"
import { backendFetch } from "../../util/backendFetch.ts"
import { useTransition } from "react";
import useCalendar from "../../util/useCalendar.tsx";

function BookingForm({ p }: { p: Property }) {

    const cal = useCalendar({ property: p })
    const app = useAppContext()
    const toast = useToastContext()
    const [submittingForm, startFormTransition] = useTransition()

    const handleBook = () => {
        startFormTransition(async () => {
            if (!app.user) {
                console.error("NOT LOGGED IN")
                return
            }

            if (!cal.startDate || !cal.endDate) {
                console.error("INVALID DATE RANGE")
                return
            }

            const body: BookingQuery = {
                userId: app.user._id,
                propertyId: p._id,
                checkInDate: cal.startDate,
                checkOutDate: cal.endDate
            }

            const { res, data } = await backendFetch<BookingQuery, Booking>(
                '/api/booking',
                {method: 'POST'},
                body
            )

            if (!res.ok) {
                toast.openToast(data.message, 'maroon')
                return
            }

            alert("Booked")
            window.location.href = "/"
        })
    }

    if (!p.availability) return (
        <>
            <p>This property is not currently available for booking.</p>
        </>
    )

    return (
        <div className="booking-form-wrapper">
            {cal.selectionContainsBooked && (
                <p>Invalid date range: contains booked days.</p>
            )}
            <cal.Component />
            <div className="book-info">
                <p>{cal.selectionLength} nights selected</p>
                <p>Cost: ${cal.selectionPrice}</p>
                <button onClick={handleBook} disabled={submittingForm}>
                    Book stay
                </button>
            </div>
        </div>
    )
}

export default BookingForm;

    