"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        length: [3, 100]
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'property',
        required: true
    }
}, {
    timestamps: true
});
// helper
function setDateTo0000(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
}
// helper
function getNumberOfNights(day1, day2) {
    setDateTo0000(day1);
    setDateTo0000(day2);
    const ms1 = day1.getMilliseconds();
    const ms2 = day2.getMilliseconds() - (1000 * 60 * 60 * 24); // Not counting the last day.
    return (ms2 - ms1) / 1000 / 60 / 60 / 24;
}
bookingSchema.virtual('numberOfNights').get(function () {
    return getNumberOfNights(this.checkInDate, this.checkOutDate);
});
bookingSchema.virtual('totalPrice').get(async function () {
    const Property = this.db.model('property');
    const property = await Property.findById(this.propertyId);
    if (!property)
        return NaN;
    const numberOfNights = getNumberOfNights(this.checkInDate, this.checkOutDate);
    return numberOfNights * property.pricePerNight;
});
exports.BookingModel = (0, mongoose_1.model)('booking', bookingSchema, 'bookings');
