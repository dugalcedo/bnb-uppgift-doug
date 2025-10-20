import { useBrowseContext } from "../../context/BrowseContext.tsx";

function BrowsePagePagination() {

    const b = useBrowseContext()

    const pageForward = () => {
        b.setParams(p => ({...p, offset: p.offset + b.perPage}))
    }

    const pageBack = () => {
        b.setParams(p => ({...p, offset: p.offset - b.perPage}))
    }

    return (
        <div className="browse-page-pagination">
            <div className="controls">
                <div>
                    {b.currentPage > 1 && (
                        <button onClick={pageBack}>
                            <img src="/icons/arr-left.svg" alt="left arrow" />
                        </button>
                    )}
                </div>
                <p>Page {b.currentPage} of {b.totalPages}</p>
                <div>
                    {b.currentPage < b.totalPages && (
                        <button onClick={pageForward}>
                            <img src="/icons/arr-right.svg" alt="right arrow" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BrowsePagePagination;