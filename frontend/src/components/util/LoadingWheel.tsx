import './LoadingWheel.css'

function LoadingWheel({ size = "30px" } : { size?: string }) {
    return (
        <img src="/icons/loading.svg" alt="loading" className="loading-wheel" style={{ width: size }} />
    )
}

export default LoadingWheel;