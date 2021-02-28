import { RepositoryFetchResult } from "../../z_vendor/getto-application/infra/repository/infra"

export type Authz = Readonly<{
    nonce: AuthzNonce
    roles: AuthzRoles
}>

export type AuthzNonce = string & { AuthzNonce: never }
function markNonce(nonce: string): AuthzNonce {
    return nonce as AuthzNonce
}

export type AuthzRoles = string[] & { AuthzRoles: never }
function markRoles(roles: string[]): AuthzRoles {
    return roles as AuthzRoles
}

export const markApiNonce_legacy = markNonce
export const markApiRoles_legacy = markRoles

type RepositoryResponse = Readonly<{
    nonce: string
    roles: string[]
}>
export function convertAuthzFromRepositoryResult(
    result: RepositoryFetchResult<RepositoryResponse>,
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
