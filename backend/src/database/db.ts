import dotenv from 'dotenv'; dotenv.config();
const { MONGO_DB_URI } = process.env;
import mongoose from 'mongoose'

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
        return true
    } catch (error) {
        console.error(error)
    }
}