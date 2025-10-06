"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = exports.CustomError = exports.getRequiredUserData = exports.createToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_exception_1 = require("hono/http-exception");
const db_js_1 = require("./database/db.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = require("hono/cookie");
const { JWT_SECRET } = process.env;
if (!JWT_SECRET)
    throw new Error("Missing env var: JWT_SECRET.");
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ name: user.name, password: user.password }, JWT_SECRET, { expiresIn: '2w' });
};
exports.createToken = createToken;
const getRequiredUserData = async (c, errorStatus = 401, errorMessage = "You must be logged in") => {
    const cookie = (0, cookie_1.getCookie)(c, 'dugbnb-token');
    if (!cookie)
        throw new http_exception_1.HTTPException(errorStatus, { message: errorMessage });
    // try parsing token
    let parsedToken;
    try {
        parsedToken = jsonwebtoken_1.default.verify(cookie, JWT_SECRET); // This can throw an error if the cookie is not a valid jwt.
        if (typeof parsedToken === 'string')
            throw null; // But the parsedToken can also be a string, which is invalid.
    }
    catch (error) {
        throw new http_exception_1.HTTPException(errorStatus, { message: errorMessage });
    }
    const user = await db_js_1.User.findOne({ name: parsedToken.name });
    if (!user)
        throw new http_exception_1.HTTPException(errorStatus, { message: errorMessage });
    return user;
};
exports.getRequiredUserData = getRequiredUserData;
class CustomError extends Error {
    status;
    data;
    constructor(init) {
        super(init.message);
        this.status = init.status;
        this.data = init.data;
    }
}
exports.CustomError = CustomError;
const handleErrors = (app) => {
    app.onError((error, c) => {
        console.log(`ERROR [${c.req.method} ${c.req.url}]`);
        if (error instanceof http_exception_1.HTTPException) {
            console.error(error);
            const res = error.getResponse();
            c.status(res.status);
            return c.json({ error: true, message: error.message || "Internal server error" });
        }
        else if (error instanceof CustomError) {
            console.error(error);
            c.status(error.status);
            return c.json({ error: true, message: error.message, data: error.data });
        }
        else if (error instanceof Error) {
            console.error(error);
            c.status(500);
            return c.json({ error: true, message: error.message || "Internal server error" });
        }
        else {
            const _error = error;
            c.status(_error?.status || 500);
            return c.json({ error: true, message: _error?.message || "Internal server error" });
        }
    });
};
exports.handleErrors = handleErrors;
