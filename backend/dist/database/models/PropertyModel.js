"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModel = void 0;
const mongoose_1 = require("mongoose");
const propertySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        length: [3, 100]
    },
    description: {
        type: String,
        required: true,
        length: [10, 300]
    },
    location: {
        type: String,
        required: true,
        length: [3, 100]
    },
    pricePerNight: {
        type: Number,
        required: true,
        min: 25,
        max: 2000
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: true
    }
});
exports.PropertyModel = (0, mongoose_1.model)('property', propertySchema, 'properties');
