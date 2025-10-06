"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const db_js_1 = require("../database/db.js");
const cookie_1 = require("hono/cookie");
const util_js_1 = require("../util.js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userRouter = new hono_1.Hono();
// Create (Sign up)
userRouter.post("/signup", async (c) => {
    const body = await c.req.json();
    const newUser = await db_js_1.User.create({
        name: body.name,
        password: body.password,
        email: body.email,
        isAdmin: false
    });
    (0, cookie_1.setCookie)(c, 'dugbnb-token', (0, util_js_1.createToken)(newUser));
    c.status(201);
    return c.json({
        message: "User created",
        data: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
});
// Log in
userRouter.post("/login", async (c) => {
    const body = await c.req.json();
    const foundUser = await db_js_1.User.findOne({ name: body.name });
    if (!foundUser)
        throw new util_js_1.CustomError({ status: 404, message: "User not found" });
    const validPassword = await bcryptjs_1.default.compare(body.password, foundUser.password);
    if (!validPassword)
        throw new util_js_1.CustomError({ status: 401, message: "Invalid password" });
    (0, cookie_1.setCookie)(c, 'dugbnb-token', (0, util_js_1.createToken)(foundUser));
    return c.json({
        message: "Logged in",
        data: {
            _id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email
        }
    });
});
// Verify cookie
userRouter.get("/verify", async (c) => {
    const user = await (0, util_js_1.getRequiredUserData)(c);
    return c.json({
        message: "User data retrieved",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    });
});
exports.default = userRouter;
