"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        length: [3, 100],
        validate: [
            {
                message: "Name must be alphanumeric.",
                validator: (v) => validator_1.default.isAlphanumeric(v)
            }
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        length: [6, 100],
        validate: [
            {
                message: "Invalid email address.",
                validator: (v) => validator_1.default.isEmail(v)
            }
        ]
    },
    password: {
        type: String,
        required: true,
        // Password will be hashed and therefore strength validation will happen before instantiation.
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});
userSchema.pre('save', async function () {
    this.password = await bcryptjs_1.default.hash(this.password, 5);
});
exports.UserModel = (0, mongoose_1.model)('user', userSchema, 'users');
