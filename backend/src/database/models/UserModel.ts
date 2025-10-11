import { Schema, model, type HydratedDocument } from "mongoose";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { UserDocInterface } from "../types/User.js";

const userSchema = new Schema<UserDocInterface>({
    name: {
        type: String,
        required: true,
        unique: true,
        length: [3, 100],
        validate: [
            {
                message: "Name must be alphanumeric.",
                validator: (v: string) => validator.isAlphanumeric(v)
            }
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        length: [6, 100],
        validate: [
            {
                message: "Invalid email address.",
                validator: (v: string) => validator.isEmail(v)
            }
        ]
    },
    password: {
        type: String,
        required: true,
        // Password will be hashed and therefore strength validation will happen before instantiation.
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
})

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 5)
})

export const UserModel = model<UserDocInterface>('user', userSchema, 'users')