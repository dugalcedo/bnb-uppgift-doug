import dotenv from 'dotenv'; dotenv.config();
const { MONGO_DB_URI } = process.env;
import mongoose from 'mongoose'
import fs from 'fs/promises'
import bcrypt from 'bcryptjs'

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
        const users = await User.find()
        console.log(users.map(u => u.name))
        // await seed()
        return true
    } catch (error) {
        console.error(error)
    }
}

async function seed() {
    const users = await User.find()
    await Promise.all(users.map(async u => {
        u.password = u.name + '1234'
        await u.save()
    }))
    console.log('done')
}