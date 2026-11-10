
const API_BASE = import.meta.env.PROD
    ? '/cprg-312/api'
    : '/api';

async function sendRequest(path, options = {}) {
    return fetch(`${API_BASE}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            ...(options.body ? {
                'Content-Type': 'application/json'
            } : {}),
            ...options.headers
        }
    });
}

export async function api(path, options = {}) {
    let response = await sendRequest(path, options);

    // Access token expired
    if (response.status === 401 &&
        path !== '/auth/login' &&
        path !== '/auth/refresh') {

        // Request a new access token
        const refreshResponse = await sendRequest(
            '/auth/refresh',
            { method: 'POST' }
        );

        if (refreshResponse.ok) {
            // Retry the original request
            response = await sendRequest(path, options);
        }
    }

    return response;
}
