import { Hono } from "hono";
import { User } from "../database/db.js";
import { createToken, CustomError, getRequiredUserData } from "../util.js";
import bcrypt from 'bcryptjs'

const userRouter = new Hono()

// Create (Sign up)
userRouter.post("/signup", async (c) => {
    const body = await c.req.json()

    const newUser = await User.create({
        name: body.name,
        password: body.password,
        email: body.email,
        isAdmin: false
    })

    c.status(201)
    return c.json({
        message: "User created",
        data: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        },
        token: createToken(newUser)
    })


})

// Log in
userRouter.post("/login", async (c) => {
    const body = await c.req.json()

    const foundUser = await User.findOne({ name: body.name })

    if (!foundUser) throw new CustomError({ status: 404, message: "User not found" });

    const validPassword = await bcrypt.compare(body.password, foundUser.password);

    if (!validPassword) throw new CustomError({ status: 401, message: "Invalid password" });

    return c.json({
        message: "Logged in",
        data: {
            _id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email
        },
        token: createToken(foundUser)
    })

})

// Verify cookie
userRouter.get("/verify", async (c) =>{
    const user = await getRequiredUserData(c)

    return c.json({
        message: "User data retrieved",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })
})

export default userRouter