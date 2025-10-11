import dotenv from 'dotenv'; dotenv.config();
const { MONGO_DB_URI } = process.env;
import mongoose from 'mongoose'
import fs from 'fs/promises'

// models
import { UserModel } from './models/UserModel.js';
import { PropertyModel } from './models/PropertyModel.js';
import { BookingModel } from './models/BookingModel.js';
import { UserType } from './types/User.js';
import { PropertyType } from './types/Property.js';
import { BookingType } from './types/Booking.js';

export const User = UserModel
export type { UserType }
export const Property = PropertyModel
export type { PropertyType }
export const Booking = BookingModel
export type { BookingType }

export async function connectToDb() {
    if (!MONGO_DB_URI) {
        throw new Error("Missing env var: MONGO_DB_URI")
    }

    try {
        await mongoose.connect(MONGO_DB_URI)
        console.log("Connected to MongoDB.")
        // await seed()
        return true
    } catch (error) {
        console.error(error)
    }
}

async function seed() {
    const doug = await User.findOne({ name: "doug" })
    const properties = await Property.find()
    await Promise.all(properties.map(async p => {
        p.userId = doug!._id
        await p.save()
    }))

    console.log('done')
}