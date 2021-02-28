import { RepositoryFetchResult } from "../../../z_vendor/getto-application/infra/repository/infra"
import { AuthzRepositoryResponse } from "../infra"

import { Authz, AuthzNonce, AuthzRoles } from "../data"

export function convertAuthzFromRepositoryResult(
    result: RepositoryFetchResult<AuthzRepositoryResponse>,
): RepositoryFetchResult<Authz> {
    if (!result.success || !result.found) {
        return result
    }

    return {
        success: true,
        found: true,
        value: {
            nonce: markNonce(result.value.nonce),
            roles: markRoles(result.value.roles),
        },
    }
}

function markNonce(nonce: string): AuthzNonce {
    return nonce as AuthzNonce
}
function markRoles(roles: string[]): AuthzRoles {
    return roles as AuthzRoles
}
