import dotenv from 'dotenv'; dotenv.config();
const PORT = parseInt(process.env.PORT) || 6392;

import { Hono } from "hono";
import { serve } from '@hono/node-server'
import frontendRouter from "./routers/frontendRouter.js"

const app = new Hono()

app.route('/', frontendRouter)

serve({
    fetch: app.fetch,
    port: PORT
})