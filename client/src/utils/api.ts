const BASE_URL = "/api";

export const api = {
    get: (path: string) => fetch(`${BASE_URL}${path}`, {
        credentials: "include",
    }),
    post: (path: string, body?: object) => fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    }),
    put: (path: string, body: object) => fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    }),
    delete: (path: string) => fetch(`${BASE_URL}${path}`, {
        method: "DELETE", 
        credentials: "include",
    }),    
};