import { useAppContext } from "../../context/AppContext.tsx";

function AdminPage() {

    const app = useAppContext()

    if (!app.user?.isAdmin) return (
        <div className="responsive">Not found</div>
    )

    return (
        <section className="page admin-page">
            <h2>Admin panel</h2>
            
        </section>
    )
}

export default AdminPage;