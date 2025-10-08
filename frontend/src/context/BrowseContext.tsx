import { createContext, type ReactNode, useState, useEffect, useContext, useTransition, type Dispatch, type SetStateAction } from "react";
import { backendFetch } from "../util/backendFetch.ts"

type PerPageOption = (
    | 10
    | 15
    | 20
    | 25
)

const PER_PAGE_OPTIONS: PerPageOption[] = [10, 15, 20, 25] as const;

type BrowseContext = {
    loading: boolean
    errorMessage?: string
    matches: Property[]
    params: BrowseParams
    total: number
    perPage: PerPageOption
    perPageOptions: PerPageOption[]
    setParams: Dispatch<SetStateAction<BrowseParams>>
    setPerPage: Dispatch<SetStateAction<PerPageOption>>
    currentPage: number
    totalPages: number
}

const initialParams: BrowseParams = {
    offset: 0,
    limit: 10,
    minPrice: 0,
    maxPrice: 200,
    sort: 'name',
    order: 1,
    showUnavailable: false
}

const initialBrowseContext: BrowseContext = {
    params: {...initialParams},
    matches: [],
    loading: true,
    total: 0,
    setParams: () => {},
    perPage: 10,
    perPageOptions: PER_PAGE_OPTIONS,
    setPerPage: () => {},
    currentPage: 1,
    totalPages: 1
}

const Context = createContext<BrowseContext>(initialBrowseContext)

export const useBrowseContext = () => useContext(Context);

// Prevent repeat fetches
const browseResultMemo: Record<string, PropertyBrowseResult> = {}

export const BrowseContextProvider = ({ children }: { children: ReactNode }) => {

    const [params, setParams] = useState<BrowseParams>({...initialParams})
    const [matches, setMatches] = useState<Property[]>([])
    const [total, setTotal] = useState(0)
    const [errorMessage, setErrorMessage] = useState<undefined | string>()
    const [loading, startTransition] = useTransition()
    const [perPage, setPerPage] = useState<PerPageOption>(10)

    const resetWithError = (msg = "Something went wrong") => {
        setMatches([])
        setTotal(0)
        setErrorMessage(msg)
    }

    useEffect(() => {

        startTransition(async () => {
            setErrorMessage(undefined)

            // Use memoized if already fetched
            const memoized = browseResultMemo[JSON.stringify(params)]
            if (memoized) {
                setTotal(memoized.total)
                setMatches(memoized.properties)
                console.log("Using memoized:", memoized)
                return
            }

            console.log("Not memoized")

            const { res, data } = await browseProperties(params)

            // Bad res
            if (!res.ok) {
                resetWithError(data.message)
                return
            }
            if (!data.data) {
                resetWithError()
                return
            }

            setMatches(data.data.properties)
            setTotal(data.data.total)
        })
    }, [params])


    const ctx: BrowseContext = {
        params,
        errorMessage,
        loading,
        matches,
        total,
        setParams,
        perPage,
        setPerPage,
        perPageOptions: PER_PAGE_OPTIONS,
        totalPages: Math.ceil(total / perPage),
        currentPage: Math.ceil(params.offset / perPage)+1
    }

    return <Context.Provider value={ctx}>{children}</Context.Provider>
}

// helpers
async function browseProperties(params: BrowseParams) {
    const path = `/api/property/browse${createQueryString(params)}`;
    const { res, data } = await backendFetch<{}, PropertyBrowseResult>(path)

    if (data.data) {
        browseResultMemo[JSON.stringify(params)] = data.data
    }

    return { res, data }
}

function createQueryString(params: BrowseParams) {
    return "?" + new URLSearchParams({
        offset: params.offset.toString(),
        limit: params.limit.toString(),
        minPrice: params.minPrice.toString(),
        maxPrice: params.maxPrice.toString(),
        showUnavailable: params.showUnavailable.toString(),
        order: params.order.toString(),
        sort: params.sort
    }).toString()
}