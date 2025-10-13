type User = {
    _id: string
    name: string
    email: string
    isAdmin: boolean
    bookings: (Booking & {
        property: Property
    })[]
    properties: Property[]
}

type Property = {
    _id: string
    name: string
    description: string
    city: string
    state: string
    country: string
    latitude: number
    longitude: number
    pricePerNight: number
    availability: boolean
    image: string
    bookings?: Booking[]
    userId: string
    user?: User
}

type PropertyBrowseResult = {
    total: number
    properties: Property[]
}

type AuthFormData = {
    name: string
    email: string
    password: string
    password2: string
}

type BrowseParams = {
    offset: number
    limit: number
    minPrice: number
    maxPrice: number
    sort: 'name' | 'pricePerNight'
    order: 1 | -1
    showUnavailable: boolean
}

type BookingQuery = {
    propertyId: string
    userId: string
    checkInDate: string
    checkOutDate: string
}

type Booking = {
    _id: string
    propertyId: string
    userId: string
    checkInDate: string
    checkOutDate: string
}