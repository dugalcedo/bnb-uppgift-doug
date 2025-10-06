"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.Property = exports.User = void 0;
exports.connectToDb = connectToDb;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGO_DB_URI } = process.env;
const mongoose_1 = __importDefault(require("mongoose"));
// models
const UserModel_js_1 = require("./models/UserModel.js");
const PropertyModel_js_1 = require("./models/PropertyModel.js");
const BookingModel_js_1 = require("./models/BookingModel.js");
exports.User = UserModel_js_1.UserModel;
exports.Property = PropertyModel_js_1.PropertyModel;
exports.Booking = BookingModel_js_1.BookingModel;
async function connectToDb() {
    if (!MONGO_DB_URI) {
        throw new Error("Missing env var: MONGO_DB_URI");
    }
    try {
        await mongoose_1.default.connect(MONGO_DB_URI);
        console.log("Connected to MongoDB.");
        return true;
    }
    catch (error) {
        console.error(error);
    }
}
