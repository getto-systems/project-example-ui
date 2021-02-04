import { ApiNonce, ApiRoles, LoadApiCredentialResult } from "./data"

export type CredentialAction = Readonly<{
    loadApiNonce: LoadApiNoncePod
    loadApiRoles: LoadApiRolesPod
}>

export interface LoadApiNoncePod {
    (): LoadApiNonce
}
export interface LoadApiNonce {
    (): LoadApiCredentialResult<ApiNonce>
}

export interface LoadApiRolesPod {
    (): LoadApiRoles
}
export interface LoadApiRoles {
    (): LoadApiCredentialResult<ApiRoles>
}
