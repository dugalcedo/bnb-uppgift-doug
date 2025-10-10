import './Calendar.css'
import { useState, useMemo } from "react"
import dayjs, { type Dayjs as D } from 'dayjs'
import dugcalwindow from "dugcalwindow"

type CalendarInit = {
    date?: string
    property?: Property
}

export default function useCalendar(init: CalendarInit) {

    // State, primitive values only! That's why they are strings.
    const [focusDate, setFocusDate] = useState<string>(f(dayjs(init.date)))
    const [startDate, setStartDate] = useState<string | null>(null)
    const [endDate, setEndDate] = useState<string | null>(null)

    // console.log({ startDate, endDate })

    // Dayjs objects
    const focusDateD = dayjs(focusDate)
    const startDateD = startDate ? dayjs(startDate) : null;
    const endDateD = endDate ? dayjs(endDate) : null;

    // Month window
    const { month, year, dates } = useMemo(() => {
        return dugcalwindow(focusDateD)
    }, [focusDate])

    // So you can check selectedDateSet.has(date)
    const selectedDateSet = useMemo(() => {
        return dateRangeToSet(startDateD, endDateD)
    }, [startDate, endDate])

    // So you can check bookedDateSet.has(date)
    const bookedDateSet = useMemo(() => {
        const set = new Set<string>()
        if (!init.property?.bookings) return set;
        for (const { checkInDate, checkOutDate } of init.property.bookings) {
            const dateRangeSet = dateRangeToSet(checkInDate, checkOutDate)
            for (const date of [...dateRangeSet]) {
                set.add(date)
            }
        }
        return set
    }, [init.property])

    // Diplayed date range
    const displayedDateRange = useMemo(() => {
        if (startDateD && endDateD) {
            return `${startDateD.format("ddd MMM D")} to ${endDateD.format("ddd MMM D")}`
        } 
        if (startDateD) {
            return `Select end date`
        }
        return "Select date range"
    }, [startDate, endDate])

    const handleDateClick = (d: D) => {
        // console.log("handling date click:", { d, startDate, endDate })

        if (startDate && endDate) {
            // console.log("start date and end date selected. starting new selection")
            // New selection
            setStartDate(f(d))
            setEndDate(null)
        } else if (startDate && d.isBefore(startDateD, 'date')) {
            // console.log("clicked date is before start date. starting new selection")
            // New selection
            setStartDate(f(d))
            setEndDate(null)
        } else if (startDate) {
            // console.log("only start date selected before this click. setting end date only.")
            // End date selection only
            setEndDate(f(d))
        } else {
            // console.log("no selection. setting start date.")
            // Start date selection only
            setStartDate(f(d))
        }
    }

    const Component = useMemo(() => () => {
        return (
            <div className="calendar-wrapper">
                <div className="calendar-selection-display">
                    {displayedDateRange}
                </div>
                <div className="calendar-date-display">
                    <button onClick={monthBackward}>PREV</button>
                    <span>{focusDateD.format('MMMM YYYY')}</span>
                    <button onClick={monthForward}>NEXT</button>
                </div>
                <div className="calendar">
                    {daysOfWeek.map(d => {
                        return <div className="dayOfWeek" key={d}>{d}</div>
                    })}
                    {dates.map(date => {
                        const formatted = date.format('YYYY-MM-DD')
                        const isBooked = bookedDateSet.has(formatted)
                        const isSelected = selectedDateSet.has(formatted)
                        
                        // Conditional classes
                        let className = "date"
                        if (isBooked) className += " booked"
                        if (isSelected) className += " selected"
                        if (formatted === endDate) className += " checkout"

                        return (
                            <button 
                                className={className} 
                                key={formatted}
                                onClick={() => handleDateClick(date)}
                                disabled={isBooked}
                            >
                                <div className="number">{date.date()}</div>
                                {isBooked && (
                                    <span className="booked">&times;</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }, [
        // Component memo dependencies
        focusDate,
        startDate,
        endDate,
        init.property
    ])

    // State actions

    const monthForward = () => {
        setFocusDate(f(focusDateD.add(1, 'month')))
    }

    const monthBackward = () => {
        setFocusDate(f(focusDateD.subtract(1, 'month')))
    }

    return {
        Component,
        startDate,
        startDateD,
        endDate,
        endDateD,

        // Derived values
        get selectionContainsBooked() {
            for (const date of [...selectedDateSet]) {
                if (bookedDateSet.has(date)) return true
            }
            return false
        },
        selectionLength: selectedDateSet.size || 0,
        selectionPrice: (selectedDateSet.size || 0)*(init.property?.pricePerNight || 0),

        // State actions
        monthForward,
        monthBackward
    }
}

/////// helpers

const f = (d: D) => d.format("YYYY-MM-DD");

const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function dateRangeToSet(start: string | D | null, end: string | D | null): Set<string> {

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