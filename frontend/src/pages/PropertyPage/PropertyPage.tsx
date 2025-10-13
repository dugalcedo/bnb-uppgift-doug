import './PropertyPage.css'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { backendFetch } from "../../util/backendFetch.ts"
import BookingForm from './BookingForm.tsx'
import PropertyMap from './PropertyMap.tsx';

const propertyMemo: Record<string, null | Property> = {};

function PropertyPage() {
    const [property, setProperty] = useState<null | Property>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const { id } = useParams()


    useEffect(() => {
        async function load() {
            if (!id) {
                setProperty(null)
                setLoading(false)
                return
            }

            setProperty(await fetchProperty(id))
            setLoading(false)
        }

        load()
    })

    if (loading) {
        return (
            <section className="property-page property-page-loading loading">
                <p>Loading...</p>
            </section>
        )
    }

    if (!property) {
        return (
            <section className="property-page property-page-error error">
                <p>Property not found</p>
            </section>
        )
    }

    return (
        <section className="property-page">

            {/* Property info */}
            <div className="property">
                <h2>{property.name}</h2>
                <div className="image">
                    <img src={property.image} alt={property.name} />
                </div>
                <div className="info">
                    <p className="price">
                        ${property.pricePerNight} &nbsp;
                        <small>/night</small>
                    </p>
                    <p className="location">
                        {property.city}, {property.state}
                    </p>
                    <p className="description">
                        {property.description}
                    </p>
                </div>
            </div>

            <PropertyMap p={property} />

            {/* Booking form */}
            <BookingForm p={property} />
        </section>
    )
}


// helper
async function fetchProperty(id: string) {
    if (propertyMemo[id]) return propertyMemo[id];
    const { data } = await backendFetch<{}, Property>(`/api/property/${id}`);
    propertyMemo[id] = data.data || null;
    return data.data || null;
}

export default PropertyPage;