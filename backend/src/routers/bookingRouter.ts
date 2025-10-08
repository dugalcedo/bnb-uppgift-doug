import { Hono } from "hono";

const bookingRouter = new Hono()

// Create booking
type CreateBookingInput = {
    propertyId: string
    userId: string
    startDate: string
    endDate: string
}
bookingRouter.post("/", async c => {
    const body: CreateBookingInput = await c.req.json()
})

export default bookingRouter
