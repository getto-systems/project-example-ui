import { ApiCommonError } from "./data"
import { ApiFeature, ApiMethod, ApiRequest } from "./infra"

export function apiRequest(feature: ApiFeature, path: string, method: ApiMethod): ApiRequest {
    return {
        url: url(),
        options: {
            method,
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-API-NONCE", feature.nonce()]],
        },
    }

    function url(): string {
        const url = new URL(feature.serverURL)
        url.pathname = path

        return url.toString()
    }
}

export function apiCommonError(status: number): ApiCommonError {
    switch (status) {
        case 401:
            return { type: "unauthorized" }

        case 409:
            return { type: "invalid-nonce" }

        default:
            return { type: "server-error" }        
    }
}
