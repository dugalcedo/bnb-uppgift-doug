"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const http_exception_1 = require("hono/http-exception");
const testRouter = new hono_1.Hono();
testRouter.get("/", (c) => {
    if (Math.random() < 0.5) {
        return c.json({ message: "Heads" });
    }
    else {
        throw new http_exception_1.HTTPException(418, { message: "Tails" });
    }
});
exports.default = testRouter;
