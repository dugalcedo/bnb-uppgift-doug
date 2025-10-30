
import { type HydratedDocument, type Types } from "mongoose";

export type BookingStatus = (
    | 'pending'
    | 'accepted'
    | 'rejected'
)

export const isBookingStatus = (str: string): str is BookingStatus => {
    return ['pending', 'accepted', 'rejected'].includes(str)
}

export interface BookingDocInterface {
    checkInDate: Date
    checkOutDate: Date
    userId: Types.ObjectId
    propertyId: Types.ObjectId
    status: BookingStatus
    // virtuals
    totalPrice: () => Promise<number>
    numberOfNights: number
}

export type BookingType = HydratedDocument<BookingDocInterface>
