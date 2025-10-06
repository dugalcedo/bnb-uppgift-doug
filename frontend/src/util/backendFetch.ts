export const DEV = window.location.href.includes('localhost') || window.location.href.includes('127.1.1');
export const BACKEND_ROOT = DEV ? 'http://localhost:6392' : '';

export const backendFetch = async <
    BodyT extends Record<string, any>,
    ResDataT
>(path: string, init?: RequestInit, body?: BodyT) => {
    const reqInit: RequestInit = {
        ...(init||{}),
        headers: {
            ...(init?.headers||{}),
            "Content-Type": "application/json"
        }
    }

    // append body if there is one
    if (body) reqInit.body = JSON.stringify(body);

    const res = await fetch(BACKEND_ROOT + path, reqInit)
    let data: { message: string, status?: number, data?: ResDataT };
    const text = await res.text()

    try {
        data = JSON.parse(text)
    } catch (error) {
        console.error(error)
        data = { message: text }
    }

    return { res, data }
}