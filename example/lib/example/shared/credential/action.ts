import { ApiNonce, ApiRoles, LoadResult } from "./data"

export type CredentialAction = Readonly<{
    loadApiNonce: LoadApiNoncePod
    loadApiRoles: LoadApiRolesPod
}>

export interface LoadApiNoncePod {
    (): LoadApiNonce
}
export interface LoadApiNonce {
    (): LoadResult<ApiNonce>
}

export interface LoadApiRolesPod {
    (): LoadApiRoles
}
export interface LoadApiRoles {
    (): LoadResult<ApiRoles>
}
