import { Hono } from "hono";
import { Booking, BookingType, Property } from "../database/db.js"
import { CustomError, getRequiredUserData } from "../util.js"
import dayjs from "dayjs";
import { dateRangeToSet, bookingDatesToSet, dateSetDoesOverlap } from "../util/dateUtils.js";

const bookingRouter = new Hono()

// Create booking
type CreateBookingInput = {
    propertyId: string
    userId: string
    checkInDate: string
    checkOutDate: string
}
bookingRouter.post("/", async c => {
    const body: CreateBookingInput = await c.req.json()

    // Verify user exists (automatically throws)
    const user = await getRequiredUserData(c)

    const now = dayjs()
    const startD = dayjs(body.checkInDate)
    const endD = dayjs(body.checkOutDate)

    // Validate dates
    if (!startD.isAfter(now, 'date')) throw new CustomError({ status: 400, message: "Start date must be in the future" })
    if (!endD.isAfter(startD, 'date')) throw new CustomError({ status: 400, message: "End date must be after start date" })

    // Verify property exists
    const property = await Property.findById(body.propertyId);
    if (!property) throw new CustomError({ status: 404, message: "Property not found" })

    // Verify dates not already booked
    const bookings = await Booking.find({ propertyId: body.propertyId })
    const selectedDateRange = dateRangeToSet(startD, endD)
    const bookingsDateRange = bookingDatesToSet(bookings)
    if (dateSetDoesOverlap(selectedDateRange, bookingsDateRange)) {
        throw new CustomError({ status: 400, message: "Selected date range includes already-booked dates" })
    }

    //TEST
    // return c.json({
    //     message: "Passed validation"
    // })
    //END TEST

    const newBooking = await Booking.create({
        userId: user._id,
        propertyId: property._id,
        checkInDate: startD.toDate(),
        checkOutDate: endD.toDate()
    })

    c.status(201)
    return c.json({
        message: "Booking booked",
        data: newBooking.toJSON()
    })
})

type DeleteBookingInput = {
    bookingId: string
    userId: string
}
bookingRouter.delete("/", async c => {
    const body: DeleteBookingInput = await c.req.json()
    await getRequiredUserData(c, {
        mustHaveUserId: body.userId
    })

    await Booking.deleteOne({ userId: body.userId, _id: body.bookingId })

    return c.json({
        message: "Booking deleted",
        data: body.bookingId
    })
})

export default bookingRouter
