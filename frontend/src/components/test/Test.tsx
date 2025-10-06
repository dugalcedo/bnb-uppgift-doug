import { useState } from "react";

function Test() {
    const [n, setN] = useState(0)

    return (
        <>
            <button onClick={() => setN(n+1)}>{n}</button>
        </>
    )
}

export default Test;