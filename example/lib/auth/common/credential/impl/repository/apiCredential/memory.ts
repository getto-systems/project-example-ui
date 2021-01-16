import { ApiCredentialRepository } from "../../../infra"

import { ApiNonce, ApiRoles, LoadResult } from "../../../data"

export function initMemoryApiCredentialRepository(
    apiNonce: ApiNonce,
    apiRoles: ApiRoles
): ApiCredentialRepository {
    return new MemoryApiCredentialRepository(apiNonce, apiRoles)
}

class MemoryApiCredentialRepository implements ApiCredentialRepository {
    apiNonce: LoadResult<ApiNonce>
    apiRoles: LoadResult<ApiRoles>

    constructor(initialApiNonce: ApiNonce, initialApiRoles: ApiRoles) {
        this.apiNonce = { success: true, found: true, content: initialApiNonce }
        this.apiRoles = { success: true, found: true, content: initialApiRoles }
    }

    findApiNonce(): LoadResult<ApiNonce> {
        return this.apiNonce
    }
    findApiRoles(): LoadResult<ApiRoles> {
        return this.apiRoles
    }
}
