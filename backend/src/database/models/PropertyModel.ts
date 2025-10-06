import { Schema, model, type HydratedDocument } from "mongoose";

interface MongoPropertyInterface {
    name: string
    description: string
    location: string
    pricePerNight: number
    availability: boolean
    image: string
}

const propertySchema = new Schema<MongoPropertyInterface>({
    name: {
        type: String,
        required: true,
        unique: true,
        length: [3, 100]
    },
    description: {
        type: String,
        required: true,
        length: [10, 300]
    },
    location: {
        type: String,
        required: true,
        length: [3, 100]
    },
    pricePerNight: {
        type: Number,
        required: true,
        min: 25,
        max: 2000
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: true
    }
})

export const PropertyModel = model<MongoPropertyInterface>('property', propertySchema, 'properties')
export type MongoPropertyType = HydratedDocument<MongoPropertyInterface>