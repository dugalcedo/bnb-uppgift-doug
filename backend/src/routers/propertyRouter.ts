import { Hono } from "hono";
import { Booking, Property } from "../database/db.js";
import { CustomError, getRequiredUserData } from "../util.js"

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
    latitude: number
    longitude: number
    image: string
}
propertyRouter.post("/", async c => {
    const body: CreatePropertyInput = await c.req.json()

    await getRequiredUserData(c, {
        mustHaveUserId: body.userId
    })

    const newProperty = await Property.create({
        userId: body.userId,
        name: body.name,
        description: body.description,
        city: body.city,
        state: body.state,
        country: body.state,
        latitude: body.latitude,
        longitude: body.longitude,
        image: body.image
    })

    return c.json({
        message: "Property created",
        data: newProperty.toJSON()
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
