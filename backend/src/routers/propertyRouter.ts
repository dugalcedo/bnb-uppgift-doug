import dotenv from 'dotenv'
dotenv.config();

import { Hono } from "hono";
import { Booking, Property } from "../database/db.js";
import { CustomError, getRequiredUserData } from "../util.js"
import getStrDistance from 'jaro-winkler'

const propertyRouter = new Hono()

// Browse
type BrowseSearchParams = {
    offset: number
    limit: number
    minPrice: number
    maxPrice: number
    sort: string
    order: 1 | -1
    showUnavailable?: boolean
}
propertyRouter.get("/browse", async (c) => {
    const {
        offset,
        limit,
        minPrice,
        maxPrice,
        showUnavailable,
        sort,
        order
    } = getBrowseSearchParams(c.req.url)


    const filter: Record<string, any> = {
        pricePerNight: { $gte: minPrice, $lte: maxPrice },
    }

    if (!showUnavailable) filter.availability = true;

    const totalDocs = await Property.countDocuments(filter);

    const matches = await Property.find(filter)
    .sort([[sort, order]])
    .skip(offset)
    .limit(limit);

    if (matches.length === 0) throw new CustomError({ status: 404, message: "No matches found", data: [] });

    return c.json({
        message: "Matches found",
        data: {
            properties: matches,
            total: totalDocs
        }
    })
})

// Get one
propertyRouter.get("/:id", async (c) => {
    const id = c.req.param('id')

    if (!id) throw new CustomError({ status: 400, message: "Missing id" })

    const property = await Property.findById(id)

    if (!property) throw new CustomError({ status: 404, message: "Not found" })

    const bookings = await Booking.find({ propertyId: property._id })

    return c.json({
        message: "Property found",
        data: {
            ...property.toJSON({ virtuals: true }),
            bookings
        }
    })
})


// Create property
type CreatePropertyInput = {
    userId: string
    name: string
    description: string
    city: string
    state: string
    country: string
    image: string
    pricePerNight: number
}
propertyRouter.post("/", async c => {
    const body: CreatePropertyInput = await c.req.json()

    await getRequiredUserData(c, {
        mustHaveUserId: body.userId
    })

    const [lat, lon] = await getLatLon(body)

    const newProperty = await Property.create({
        userId: body.userId,
        name: body.name,
        description: body.description,
        city: body.city,
        state: body.state,
        country: body.state,
        latitude: lat,
        longitude: lon,
        image: body.image,
        pricePerNight: body.pricePerNight,
        availability: true
    })

    return c.json({
        message: "Property created",
        data: newProperty.toJSON()
    })
})

// Delete property
type DeletePropertyInput = {
    propertyId: string
    userId: string
}
propertyRouter.delete("/", async c => {
    const body: DeletePropertyInput = await c.req.json()
    await getRequiredUserData(c, { mustHaveUserId: body.userId })
    await Property.findByIdAndDelete(body.propertyId)
    return c.json({
        message: "Property deleted",
        dat: body.propertyId
    })
})

export default propertyRouter

// helper
const parseNum = (str: string | undefined | null, def: number) => {
    if (typeof str !== 'string') return def;
    if (!str.trim()) return def;
    const n = Number(str)
    return isNaN(n) ? def : n;
}

// helper
const parseSortOrder = (str: string | undefined | null): 1 | -1 => {
    const n = parseNum(str, 1)
    return n > 0 ? 1 : -1;
}

// helper
const getBrowseSearchParams = (url: string): BrowseSearchParams => {
    const sp = new URL(url).searchParams
    return {
        offset: parseNum(sp.get('offset'), 0),
        limit: parseNum(sp.get('limit'), 10),
        minPrice: parseNum(sp.get('minPrice'), 0),
        maxPrice: parseNum(sp.get('maxPrice'), 250),
        sort: sp.get('sort') || 'name',
        order: parseSortOrder(sp.get('order')),
        showUnavailable: (sp.get('showUnavailable') || 'false') === 'true',
    }
}

// helper
type GeocodingAPIResult = {
    features?: {
        properties?: {
            country: string
            city: string
            state: string
            lat: number
            lon: number
            region: string
        }
    }[]
}
const getLatLon = async (body: CreatePropertyInput): Promise<[number, number]> => {
    const err = new CustomError({ status: 400, message: "Location not found. Check form data and try again." })
    const url = `https://api.geoapify.com/v1/geocode/search?text=${body.name} ${body.city} ${body.state} ${body.country}&apiKey=${process.env.GEOCODING_API_KEY}`
    const res = await fetch(url)
    const data = await res.json() as GeocodingAPIResult
    if (!data.features) throw err;
    const match = data.features.find(f => {
        if (!f.properties) return;
        const cityIsSimilar = stringIsEmptyOrSimilar(body.city, f.properties.city)
        const stateIsSimilar = (
            (!f.properties.state && !f.properties.region)
            || (stringIsEmptyOrSimilar(body.state, f.properties.state))
            || (stringIsEmptyOrSimilar(body.state, f.properties.region))
        )
        const countryIsSimilar = stringIsEmptyOrSimilar(body.country, f.properties.country)
        return (
            cityIsSimilar
            && stateIsSimilar
            && countryIsSimilar
        )
    })
    if (!match?.properties) throw err;
    return [match.properties.lat, match.properties.lon]
}


// helper
const stringIsEmptyOrSimilar = (str1: string | undefined, str2: string) => {
    if (!str1) return true;
    str1 = str1.trim().toLowerCase()
    str2 = str2.trim().toLowerCase()
    return (str1 === "") || (getStrDistance(str1, str2) > 0.5)
}