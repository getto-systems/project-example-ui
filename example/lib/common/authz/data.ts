export type Authz = Readonly<{
    nonce: AuthzNonce
    roles: AuthzRoles
}>

export type AuthzNonce = string & { AuthzNonce: never }
export type AuthzRoles = string[] & { AuthzRoles: never }
