import { Hono } from "hono";
import { Booking, BookingType, Property } from "../database/db.js"
import { CustomError, getRequiredUserData } from "../util.js"
import dayjs from "dayjs";
import { dateRangeToSet, bookingDatesToSet, dateSetDoesOverlap } from "../util/dateUtils.js";
import { isBookingStatus } from "../database/types/Booking.js"

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

// Delete
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


// Get by propertyId
bookingRouter.get("/byPropertyId/:id", async c => {
    const id = c.req.param('id')
    const property = await Property.findById(id)

    if (!property) throw new CustomError({
        status: 404,
        message: "Property not found"
    })

    const bookings = await Booking.find({ propertyId: id })
    return c.json({
        message: "Searched",
        data: await Promise.all(bookings.map(async b => {
            const bookingObj = b.toObject({ virtuals: true })
            return {
                ...bookingObj,
                totalPrice: bookingObj.numberOfNights * property.pricePerNight
            }
        })),
    })
})

// Update booking status
type UpdateBookingStatusInput = {
    bookingId: string
    status: string
}
bookingRouter.put("/updateStatus", async c => {
    const body: UpdateBookingStatusInput = await c.req.json()

    if (!isBookingStatus(body.status)) {
        throw new CustomError({
            status: 400,
            message: "Invalid status"
        })
    }

    const booking = await Booking.findById(body.bookingId)

    if (!booking) throw new CustomError({
        status: 404,
        message: "Booking not found"
    })

    const property = await Property.findById(booking.propertyId)

    if (!property) throw new CustomError({
        status: 404,
        message: "Booking found but property not found"
    })

    await getRequiredUserData(c, {
        mustHaveUserId: property.userId.toString()
    })

    booking.status = body.status
    await booking.save()

    return c.json({
        message: "Booking updated"
    })
})

export default bookingRouter
