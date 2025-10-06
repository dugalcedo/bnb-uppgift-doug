import { Hono } from "hono";
import { HTTPException } from "hono/http-exception"

const testRouter = new Hono();

testRouter.get("/", (c) => {
    if (Math.random() < 0.5) {
        return c.json({ message: "Heads" })
    } else {
        throw new HTTPException(418, { message: "Tails" })
    }
})

export default testRouter;