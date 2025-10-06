"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT) || 6392;
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const node_server_1 = require("@hono/node-server");
const db_js_1 = require("./database/db.js");
const util_js_1 = require("./util.js");
// Import routers
const testRouter_js_1 = __importDefault(require("./routers/testRouter.js"));
const frontendRouter_js_1 = __importDefault(require("./routers/frontendRouter.js"));
const userRouter_js_1 = __importDefault(require("./routers/userRouter.js"));
const app = new hono_1.Hono();
// CORS
app.use((0, cors_1.cors)());
// Logger
app.use(async (c, next) => {
    console.log(`NEW REQUEST [${c.req.method} ${c.req.url}]`);
    await next();
});
// Error handling
// Ensure all error responses are the same type for easier client-side handling
(0, util_js_1.handleErrors)(app);
app.route('/api/test', testRouter_js_1.default);
app.route('/api/user', userRouter_js_1.default);
app.route('/', frontendRouter_js_1.default);
// START
(async () => {
    const connected = await (0, db_js_1.connectToDb)();
    // Database test route
    app.get('/api/test/db', c => {
        if (connected) {
            return c.json({ message: "The server is connected to the database." });
        }
        else {
            c.status(503);
            return c.json({ message: "The server failed connecting to the database." });
        }
    });
    console.log(`BACKEND: http://localhost:${PORT}/test`);
    console.log(`FRONTEND: http://localhost:5173`);
    (0, node_server_1.serve)({
        fetch: app.fetch,
        port: PORT
    });
})();
