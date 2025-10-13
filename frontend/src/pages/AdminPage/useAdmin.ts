import { useToastContext } from "../../context/ToastContext.tsx"
import { useBackendFetchOnFirstMount, backendFetch } from "../../util/backendFetch.ts"

type AdminPanelData = {
    adminId: string
    properties: Property[]
    bookings: Booking[]
}

export default function useAdmin() {
    const toast = useToastContext()

    const { 
        res: adminRes, 
        data: adminData, 
        loading: adminDataLoading, 
        error: adminDataError,
        setData: setAdminData
    } = useBackendFetchOnFirstMount<{}, AdminPanelData>('/api/admin')

    return {
        res: adminRes,
        data: adminData,
        loading: adminDataLoading,
        error: adminDataError,
        deleteProperty: async (p: Property) => {
            const { res, data: delData } = await backendFetch(
                `/api/property`,
                { method: "DELETE" },
                { propertyId: p._id, userId: adminData.data?.adminId }
            )
    
            if (!res.ok) {
                toast.openToast(delData.message, 'maroon')
                return
            }
    
            toast.openToast(delData.message, 'green')
            // update state after deletion
            const delIndex = adminData.data?.properties.findIndex(p2 => p2._id === p._id) || -1;
            adminData.data?.properties.splice(delIndex, 1)
            setAdminData(structuredClone(adminData))
        },
        deleteBooking: async (b: Booking) => {
            const { res, data: delData } = await backendFetch(
                `/api/booking`,
                { method: "DELETE" },
                { bookingId: b._id, userId: adminData.data?.adminId }
            )
    
            if (!res.ok) {
                toast.openToast(delData.message, 'maroon')
                return
            }
    
            toast.openToast(delData.message, 'green')
            // update state after deletion
            const delIndex = adminData.data?.bookings.findIndex(b2 => b2._id === b._id) || -1;
            adminData.data?.bookings.splice(delIndex, 1)
            setAdminData(structuredClone(adminData))
        }
    }
}