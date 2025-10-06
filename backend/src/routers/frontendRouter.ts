import dotenv from 'dotenv'; dotenv.config();
const DEV = process.env.DEV == 'true';
import { Hono } from "hono";
import { serveStatic } from '@hono/node-server/serve-static'
import fs from 'fs'

const FRONTEND_ROUTES = [
    '/',
    '/auth'
] as const;

const getFrontendHtml = () => {
    try {
        return fs.readFileSync('frontend/dist/index.html', 'utf-8')
    } catch {
        return
    }
}

const FRONTEND_HTML = getFrontendHtml();

const frontendRouter = new Hono()

// Serve static the frontend/dist folder so the React app can load assets
frontendRouter.use('/*', serveStatic({ root: './frontend/dist' }))

// Re-route all frontend routes to the React frontend
for (const ROUTE of FRONTEND_ROUTES) {
    frontendRouter.get(ROUTE, (c) => {
        if (FRONTEND_HTML) {
            return c.html(FRONTEND_HTML)
        } else if (DEV) {
            c.status(500)
            return c.html(`
                The frontend has not been built.
                <br> To preview the frontend build, you must run "npm run build" or "pnpm build" first.
                <br> If developing, run "npm run dev:npm" or "pnpm dev", and go to http://localhost:5173 to view the frontend.
            `)
        } else {
            c.status(500)
            console.error("The server was started without a frontend build.")
            return c.html(`Internal server error.`)
        }
    })
}


export default frontendRouter