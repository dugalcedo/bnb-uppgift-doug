import dotenv from 'dotenv'; dotenv.config();
import { Context, Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { User, UserType } from "./database/db.js"
import jwt from 'jsonwebtoken'
import { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status'
import { getCookie } from 'hono/cookie';

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) throw new Error("Missing env var: JWT_SECRET.");

export const createToken = (user: UserType) => {
    return jwt.sign(
        { name: user.name, password: user.password },
        JWT_SECRET,
        { expiresIn: '2w' }
    )
}

export const getRequiredUserData = async (
    c: Context, 
    errorStatus: ContentfulStatusCode = 401, 
    errorMessage: string = "You must be logged in"
): Promise<UserType> => {
    const cookie = getCookie(c, 'dugbnb-token')

    if (!cookie) throw new HTTPException(errorStatus, { message: errorMessage });

    // try parsing token
    let parsedToken: jwt.JwtPayload | string;
    try {
        parsedToken = jwt.verify(cookie, JWT_SECRET) // This can throw an error if the cookie is not a valid jwt.
        if (typeof parsedToken === 'string') throw null; // But the parsedToken can also be a string, which is invalid.
    } catch (error) {
        throw new HTTPException(errorStatus, { message: errorMessage });
    }

    const user = await User.findOne({ name: parsedToken.name })

    if (!user) throw new HTTPException(errorStatus, { message: errorMessage });

    return user;
}

type CustomErrorInit = {
    message: string
    status: StatusCode
    data?: any
}

export class CustomError extends Error {
    status: StatusCode
    data?: any

    constructor(init: CustomErrorInit) {
        super(init.message)
        this.status = init.status
        this.data = init.data
    }
}

export const handleErrors = (app: Hono) => {
    app.onError((error, c) => {
        console.log(`ERROR [${c.req.method} ${c.req.url}]`)
        if (error instanceof HTTPException) {
            console.error(error)
            const res = error.getResponse()
            c.status(res.status as StatusCode)
            return c.json({ error: true, message: error.message || "Internal server error" })
        } else if (error instanceof CustomError) {
            console.error(error)
            c.status(error.status)
            return c.json({ error: true, message: error.message, data: error.data })
        } else if (error instanceof Error) {
            console.error(error)
            c.status(500)
            return c.json({ error: true, message: error.message || "Internal server error" })
        } else {
            const _error = error as unknown as any;
            c.status(_error?.status || 500)
            return c.json({ error: true, message: _error?.message || "Internal server error" })
        }
    })
}