
import { type HydratedDocument } from "mongoose";

export interface UserDocInterface {
    name: string
    email: string
    password: string
    isAdmin: boolean
}

export type UserType = HydratedDocument<UserDocInterface>
