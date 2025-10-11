import { Hono } from "hono";
import { getRequiredUserData } from "../util.js"
import { Booking, Property, User } from "../database/db.js"

const adminRouter = new Hono()

// Get admin panel data
// In the future, pagination should be implemented or the json will be too large
adminRouter.get("/", async c => {
    await getRequiredUserData(c, {
        mustBeAdmin: true
    })

    const properties = await Property.find()
    const propertiesWithUser = await Promise.all(properties.map(async p => {
        const user = await User.findById(p.userId)
        return {
            ...p.toJSON(),
            user: user?.toJSON()
        }
    }))

    const bookings = await Booking.find()
    const bookingsWithProperties = bookings.map(b => {
        const bookingProperties = properties.filter(p => p._id.toString() === b.propertyId.toString())
            .map(p => p.toJSON());
        return {
            ...b.toJSON(),
            properties: bookingProperties
        }
    })

    return c.json({
        message: "Admin panel data retrieved",
        data: {
            properties: propertiesWithUser,
            bookings: bookingsWithProperties
        }
    })
})

export default adminRouter