import './BrowsePage.css'
import BrowsePageFilter from './BrowsePageFilter.tsx'
import BrowsePagePagination from './BrowsePagePagination.tsx'
import BrowseResults from "./BrowseResults.tsx"


function BrowsePage() {

    return (
        <section className="browse-page responsive">
            <h2 style={{ textAlign: 'center', marginBottom: "2rem" }}>Browse properties</h2>
            <BrowsePageFilter />
            <BrowsePagePagination />
            <BrowseResults />
            <BrowsePagePagination />
        </section>
    )
}

export default BrowsePage;