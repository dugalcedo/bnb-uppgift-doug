import './Header.css'
import NavItems from './NavItems.tsx'
import useClickOutside from '../../util/useClickOutside.ts'

import { useState, useRef } from 'react'

function Header() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const mobileNavRef = useRef<HTMLDivElement>(null)
    useClickOutside(mobileNavRef, () => {
        setMobileMenuOpen(false)
    })

    return (
        <>
            <div className="header-container">
                <header className="header-mobile responsive">
                    <div className="left">
                        <h1>DougBnB</h1>
                    </div>
                    <div className="dropdown" ref={mobileNavRef}>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>MENU</button>
                        <nav 
                            className={`menu ${mobileMenuOpen?"open":""}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <NavItems />
                        </nav>
                    </div>
                </header>

                <header className="header-desktop responsive">
                    <div className="left">
                        <h1>DougBnB</h1>
                    </div>
                    <nav>
                        <NavItems />
                    </nav>
                </header>
            </div>
        </>
    )
}

export default Header;