import { useAppContext } from "../../context/AppContext.tsx";
import { Link } from "react-router-dom";
import { logOut } from "../../util/util.ts";

const navItems = [
    { type: "link", text: "Home", href: "/" },
    { type: "link", text: "Browse", href: "/browse" },
    { type: "link", text: "Your account", href: "/profile", hide: "loggedOut" },
    { type: "button", text: "Log out", fn: logOut, hide: "loggedOut" },
    { type: "link", text: "Log in", href: "/auth", hide: "loggedIn" }
]

function NavItems() {

    const app = useAppContext()

    const shownNavItems = navItems.filter(item => {
        if (item.hide === 'loggedOut' && !app.user) return false;
        if (item.hide === 'loggedIn' && app.user) return false;
        return true
    })

    return shownNavItems.map(item => {
        if (item.type === 'link') return (
            <Link key={item.text} to={item.href||"/"}>{item.text}</Link>
        )

        if (item.type === 'button') return (
            <button key={item.text} onClick={item.fn}>{item.text}</button>
        )
    })
}

export default NavItems;