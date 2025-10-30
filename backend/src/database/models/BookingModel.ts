import { Schema, model, type HydratedDocument, Types } from "mongoose";
import { BookingDocInterface } from "../types/Booking.js";
import dayjs from "dayjs";

const bookingSchema = new Schema<BookingDocInterface>({
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: 'property',
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'rejected', 'accepted']
    }
}, {
    timestamps: true,
    virtuals: true,
    methods: {
        async totalPrice(numberOfNights: number) {
            const P = this.db.model('property')
            const p = await P.findById(this.propertyId)
            if (!p) return -1;
            return numberOfNights * p.pricePerNight
        }
    }
})

// helper
function getNumberOfNights(day1: Date, day2: Date): number {
    const day1D = dayjs(day1)
    const day2D = dayjs(day2)
    return day2D.diff(day1D, 'day')
}

bookingSchema.virtual('numberOfNights').get(function() {
    return getNumberOfNights(this.checkInDate, this.checkOutDate)
})


export const BookingModel = model<BookingDocInterface>('booking', bookingSchema, 'bookings')