import { useAppContext } from '../../context/AppContext.tsx'
import './Header.css'
import { Link } from 'react-router-dom';
import { logOut } from '../../util/util.ts';

function Header() {
    const ctx = useAppContext()

    return (
        <>
            <header className="header-mobile responsive">
                <div className="left"></div>
                <div className="middle">
                    <h1>DougBnB</h1>
                </div>
                <div className="right"></div>
            </header>
            <nav>
                <div className="responsive">
                    <Link to="/">Home</Link>
                    <Link to="/browse">Browse</Link>
                    {ctx.user ? ( // Logged in
                        <>
                            <Link to="/profile">Your bookings</Link>
                            {ctx.user.isAdmin && <Link to="/admin">Admin panel</Link>}
                            <button onClick={logOut}>
                                Log out
                            </button>      
                        </>
                    ) : ( // Logged out
                        <>
                            <Link to="/auth">Log in</Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Header;