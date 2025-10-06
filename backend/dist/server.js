"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT) || 6392;
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const frontendRouter_js_1 = __importDefault(require("./routers/frontendRouter.js"));
const app = new hono_1.Hono();
app.route('/', frontendRouter_js_1.default);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: PORT
});
