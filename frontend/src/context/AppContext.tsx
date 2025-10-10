import { createContext, type ReactNode, useState, useEffect, useContext } from "react";
import { backendFetch } from "../util/backendFetch.ts"

type AppContext = {
    databaseConnected: null | boolean
    user: null | User
}

const initialAppContext = {
    databaseConnected: null,
    user: null
}

const Context = createContext<AppContext>(initialAppContext)

export const useAppContext = () => useContext(Context);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {

    const [databaseConnected, setDatabaseConnected] = useState<null | boolean>(null)
    const [user, setUser] = useState<User | null>(null)

    console.log({user})

    useEffect(() => {
        async function loadData() {
            setDatabaseConnected(await testDatabaseConnection())
            setUser(await getUserData())
        }

        loadData()
    }, [])

    const ctx: AppContext = {
        databaseConnected,
        user
    }

    return <Context.Provider value={ctx}>{children}</Context.Provider>
}

export const AppContextDebug = () => {
    const ctx = useAppContext()

    return <div className="app-context-debug" onClick={e => e.currentTarget.remove()}>
        <p>DB: {ctx.databaseConnected === null ? 'Loading...' : ctx.databaseConnected ? 'YES' : 'NO'}</p>
        <p>Logged in: {ctx.user ? 'YES' : 'NO'}</p>
    </div>
}

// helpers

async function testDatabaseConnection() {
    const { res } = await backendFetch("/api/test/db")
    if (!res.ok) return false;
    return true;
}

async function getUserData() {
    const { res, data } = await backendFetch<{}, User>("/api/user/verify")
    if (!res.ok) return null;
    return data.data || null;
}