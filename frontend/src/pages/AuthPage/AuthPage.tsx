import './AuthPage.css'
import { useState } from "react";
import SignUpForm from './SignUpForm.tsx';
import LogInForm from './LogInForm.tsx';

function AuthPage() {

    const [signingUp, setSigningUp] = useState(true)

    return (
        <section className="auth-page">
            <h3>{signingUp ? 'Sign up' : 'Log in'}</h3>
            <div className="toggle">
                <button onClick={() => setSigningUp(true)} className={`${signingUp ? 'selected' : ''}`}>Sign up</button>
                <button onClick={() => setSigningUp(false)} className={`${!signingUp ? 'selected' : ''}`}>Log in</button>
            </div>
            {signingUp ? <SignUpForm /> : <LogInForm />}
        </section>
    )
}

export default AuthPage;