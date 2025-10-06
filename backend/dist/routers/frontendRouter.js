"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEV = process.env.DEV == 'true';
const hono_1 = require("hono");
const serve_static_1 = require("@hono/node-server/serve-static");
const fs_1 = __importDefault(require("fs"));
const FRONTEND_ROUTES = [
    '/',
    '/auth'
];
const getFrontendHtml = () => {
    try {
        return fs_1.default.readFileSync('frontend/dist/index.html', 'utf-8');
    }
    catch {
        return;
    }
};
const FRONTEND_HTML = getFrontendHtml();
const frontendRouter = new hono_1.Hono();
// Re-route all frontend routes to the React frontend
for (const ROUTE of FRONTEND_ROUTES) {
    frontendRouter.get(ROUTE, (c) => {
        if (FRONTEND_HTML) {
            return c.html(FRONTEND_HTML);
        }
        else if (DEV) {
            c.status(500);
            return c.html(`
                The frontend has not been built.
                <br> To preview the frontend build, you must run "npm run build" or "pnpm build" first.
                <br> If developing, run "npm run dev:npm" or "pnpm dev", and go to http://localhost:5173 to view the frontend.
            `);
        }
        else {
            c.status(500);
            console.error("The server was started without a frontend build.");
            return c.html(`Internal server error.`);
        }
    });
}
// Serve static the frontend/dist folder so the React app can load assets
frontendRouter.use('/*', (0, serve_static_1.serveStatic)({ root: './frontend/dist' }));
exports.default = frontendRouter;
