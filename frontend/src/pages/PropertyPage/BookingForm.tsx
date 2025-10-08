import useCalendar from "../../util/useCalendar.tsx";

function BookingForm({ p }: { p: Property }) {

    const cal = useCalendar({ property: p })

    const handleBook = () => {

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
            <p>{cal.selectionLength} nights selected</p>
            <p>Cost: ${cal.selectionPrice}</p>
            <button onClick={handleBook}>
                Book stay
            </button>
        </div>
    )
}

export default BookingForm;

    