
import { type HydratedDocument, type Types } from "mongoose";

export interface PropertyDocInterface {
    name: string
    description: string
    city: string
    state: string
    country: string
    latitude: number
    longitude: number
    pricePerNight: number
    availability: boolean
    image: string
    userId: Types.ObjectId
}

export type PropertyType = HydratedDocument<PropertyDocInterface>
