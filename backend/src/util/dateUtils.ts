import dayjs, { type Dayjs as D } from "dayjs";

const f = (d: D) => d.format("YYYY-MM-DD");

export function dateRangeToSet(start: string | D | null, end: string | D | null): Set<string> {

    const set = new Set<string>;

    if (start === null) return set;

    // Avoid creating new dayjs objects if not necessary
    let startD = typeof start === 'string' ? dayjs(start) : start;

    if (end === null) {
        set.add(f(startD))
        return set
    };

    const endD = typeof end === 'string' ? dayjs(end) : end;
    
    let limit = 100;
    while (limit > 0 && startD.isBefore(endD, 'date')) {
        set.add(f(startD))
        startD = startD.add(1, 'day')
        limit--
    }

    return set
}

interface HasCheckInDateAndCheckOutDate {
    checkInDate: Date
    checkOutDate: Date
}
export const bookingDatesToSet = (bookings: HasCheckInDateAndCheckOutDate[]) => {
    const set = new Set<string>()
    for (const { checkInDate, checkOutDate } of bookings) {
        const dateRangeSet = dateRangeToSet(checkInDate.toString(), checkOutDate.toString())
        for (const date of [...dateRangeSet]) {
            set.add(date)
        }
    }
    return set
}

export const dateSetDoesOverlap = (set1: Set<string>, set2: Set<string>) => {
    for (const date of [...set1]) {
        if (set2.has(date)) return true
    }
    return false
}