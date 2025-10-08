import dotenv from 'dotenv'; dotenv.config();
const { MONGO_DB_URI } = process.env;
import mongoose from 'mongoose'
import fs from 'fs/promises'

// models
import { UserModel, type MongoUserType } from './models/UserModel.js';
import { PropertyModel, type MongoPropertyType } from './models/PropertyModel.js';
import { BookingModel, type MongoBookingType } from './models/BookingModel.js';
export const User = UserModel
export type UserType = MongoUserType
export const Property = PropertyModel
export type PropertyType = MongoPropertyType
export const Booking = BookingModel
export type BookingType = MongoBookingType

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
    const propertyId = "68e4e0b6f127456676cdb4bc"
    const userId = "68e3fad91bffd0fd52447d82"
    const checkInDate = new Date('2025-10-01')
    const checkOutDate = new Date('2025-10-31')
    await Booking.create({ propertyId, userId, checkInDate, checkOutDate })
}