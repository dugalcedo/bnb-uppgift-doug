import dayjs from 'dayjs'
import { useToastContext } from '../../context/ToastContext.tsx'
import { backendFetch } from '../../util/backendFetch.ts'
const f = (str: string) => dayjs(str).format("ddd, D MMM YYYY")

type SingleBookingManagerProps = {
    booking: Booking
}

function SingleBookingManager({
    booking
}: SingleBookingManagerProps) {

    const toast = useToastContext()

    const handleChangeStatus = async (status: 'pending' | 'accepted' | 'rejected') => {
        const { res, data } = await backendFetch<{ bookingId: string, status: string }, {}>(
            `/api/booking/updateStatus`,
            { method: "PUT" },
            { bookingId: booking._id, status }
        )

        if (!res.ok) {
            toast.openToast(data.message, "maroon")
            return
        }

        window.location.reload()
    }

    return (
        <div className="booking" key={booking._id}>
            <table>
                <tbody>
                    <tr>
                        <th>Status</th>
                        <td>{booking.status}</td>
                    </tr>
                    <tr>
                        <th>Start date</th>
                        <td>{f(booking.checkInDate)}</td>
                    </tr>
                    <tr>
                        <th>End date</th>
                        <td>{f(booking.checkOutDate)}</td>
                    </tr>
                    <tr>
                        <th>Number of nights</th>
                        <td>{booking.numberOfNights}</td>
                    </tr>
                    <tr>
                        <th>Value</th>
                        <td>${booking.totalPrice.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div className="controls">
                {booking.status === 'pending' && (
                    <>
                        <button className="acc" onClick={() => handleChangeStatus('accepted')}>Accept</button>
                        <button className="rej" onClick={() => handleChangeStatus('rejected')}>Reject</button>
                    </>
                )}

                {booking.status === 'accepted' && (
                    <>
                        <button className="rej" onClick={() => handleChangeStatus('rejected')}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    )
}

export default SingleBookingManager;