export const logOut = (refreshPath: any  = "/") => {
    if (typeof refreshPath !== 'string') refreshPath = "/";
    localStorage.removeItem('dugbnb-token')
    if (refreshPath === 'current') {
        window.location.reload()
    } else {
        window.location.href = refreshPath
    }
}