
import { type HydratedDocument, type Types } from "mongoose";

export interface BookingDocInterface {
    checkInDate: Date
    checkOutDate: Date
    userId: Types.ObjectId
    propertyId: Types.ObjectId
    // virtuals
    totalPrice: () => Promise<number>
    numberOfNights: number
}

export type BookingType = HydratedDocument<BookingDocInterface>
