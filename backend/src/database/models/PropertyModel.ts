import { Schema, Types, model, type HydratedDocument } from "mongoose";
import { PropertyDocInterface } from "../types/Property.js";

const propertySchema = new Schema<PropertyDocInterface>({
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
    city: {
        type: String,
        required: true,
        length: [3, 100]
    },
    state: {
        type: String,
        required: true,
        length: [3, 100]
    },
    country: {
        type: String,
        required: true,
        length: [3, 100]
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
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
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

export const PropertyModel = model<PropertyDocInterface>('property', propertySchema, 'properties')