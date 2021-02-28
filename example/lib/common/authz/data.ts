export type Authz = Readonly<{
    nonce: AuthzNonce
    roles: AuthzRoles
}>

export type AuthzNonce = string & { AuthzNonce: never }
export type AuthzRoles = string[] & { AuthzRoles: never }

export const markApiNonce_legacy = markNonce
export const markApiRoles_legacy = markRoles

function markNonce(nonce: string): AuthzNonce {
    return nonce as AuthzNonce
}
function markRoles(roles: string[]): AuthzRoles {
    return roles as AuthzRoles
}
