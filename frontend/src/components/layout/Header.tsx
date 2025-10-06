import './Header.css'
import { Link } from 'react-router-dom';

function Header() {
    return (
        <>
            <header className="header-mobile">
                <div className="left"></div>
                <div className="middle">
                    <h1>DougBnB</h1>
                </div>
                <div className="right"></div>
            </header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/search">Search</Link>
                <Link to="/auth">Log in</Link>
            </nav>
        </>
    )
}

export default Header;