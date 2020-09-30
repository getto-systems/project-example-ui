import { ApiCredentialRepository, FindResponse } from "../../../infra"

import { ApiCredential } from "../../../../credential/data"

export function initMemoryApiCredentialRepository(initialApiCredential: ApiCredential): ApiCredentialRepository {
    return new Repository(initialApiCredential)
}

class Repository implements ApiCredentialRepository {
    data: {
        apiCredential: Found<ApiCredential>
    }

    constructor(initialApiCredential: ApiCredential) {
        this.data = {
            apiCredential: {
                found: true,
                content: initialApiCredential,
            },
        }
    }

    findApiCredential(): FindResponse<ApiCredential> {
        return { success: true, ...this.data.apiCredential }
    }
}

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>
