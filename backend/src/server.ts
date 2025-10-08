import dotenv from 'dotenv'; dotenv.config();
const PORT = parseInt(process.env.PORT) || 6392;

import { Hono } from "hono";
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server'
import { connectToDb } from './database/db.js';
import { handleErrors } from './util.js'

// Import routers
import testRouter from './routers/testRouter.js';
import frontendRouter from "./routers/frontendRouter.js"
import userRouter from './routers/userRouter.js';
import propertyRouter from './routers/propertyRouter.js';
import bookingRouter from './routers/bookingRouter.js';

const app = new Hono()

// CORS
app.use(cors())

// Logger
app.use(async (c, next) => {
    console.log(`NEW REQUEST [${c.req.method} ${c.req.url}]`)
    console.log(`TOKEN: ${c.req.header('x-token')}`)
    await next()
})

// Error handling
// Ensure all error responses are the same type for easier client-side handling
handleErrors(app)

app.route('/api/test', testRouter);
app.route('/api/user', userRouter);
app.route('/api/property', propertyRouter);
app.route('/api/booking', bookingRouter);

// START
(async () => {

    const connected = await connectToDb()

    // Database test route
    app.get('/api/test/db', c => {
        if (connected) {
            return c.json({ message: "The server is connected to the database." })
        } else {
            c.status(503)
            return c.json({ message: "The server failed connecting to the database." })
        }
    })

    app.route('/', frontendRouter);

    console.log(`BACKEND: http://localhost:${PORT}/test`)
    console.log(`FRONTEND: http://localhost:5173`)

    serve({
        fetch: app.fetch,
        port: PORT
    })
})();
