import { useBrowseContext } from "../../context/BrowseContext.tsx"
import { Link } from "react-router-dom"

function BrowseResults() {

    const b = useBrowseContext()

    if (b.loading) return (
        <div className="loading browse-results-loading">
            Loading...
        </div>
    )

    if (b.errorMessage) return (
        <div className="error browse-results-error">
            <p>{b.errorMessage}</p>
        </div>
    )

    return (
        <div className="browse-results">
            {b.matches.map(p => <BrowseResult key={p._id} p={p} />)}
        </div>
    )
}

///// BROWSE RESULT

function BrowseResult({ p }: { p: Property }) {
    return (
        <Link to={`/property/${p._id}`} className="browse-result">
            <div className="image">
                <img src={p.image} alt="IMAGE" />
            </div>
            <div className="info">
                <h3>{p.name}</h3>
                <div className="info-info">
                    <p className="price">
                        ${p.pricePerNight} &nbsp;
                        <small>/night</small>
                    </p>
                    <p className="location">
                        {p.city}, {p.state}
                    </p>
                    <p className="desc">
                        {p.description}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default BrowseResults;