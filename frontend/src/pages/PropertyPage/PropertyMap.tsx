import LeafletMap from "../../components/util/LeafletMap.tsx";

function PropertyMap({ p }: { p: Property }) {
    return (
        <>
            <LeafletMap 
                lat={p.latitude}
                lon={p.longitude}
            />            
        </>
    )
}

export default PropertyMap;