import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { useRef, useEffect, useState } from 'react';

type LeafletMapProps = {
    lat: number
    lon: number
    zoom?: number
}

function LeafletMap({ lat, lon, zoom = 13 }: LeafletMapProps) {

    const mapRef = useRef<HTMLDivElement>(null)
    const initRef = useRef(false)

    useEffect(() => {
        if (!mapRef.current) return
        if (initRef.current) return

        // Init map
        const map = L.map(mapRef.current)
            .setView([lat, lon], zoom)

        // Init tiles
        L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Set marker
        L.marker([lat, lon]).addTo(map)

        initRef.current = true
    }, [])


    return (
        <div className="map" ref={mapRef} style={{
            aspectRatio: "1",
            width: "100%",
            maxHeight: "400px",
            overflow: "hidden",
            borderRadius: "1rem"
        }}></div>
    )
}

export default LeafletMap;