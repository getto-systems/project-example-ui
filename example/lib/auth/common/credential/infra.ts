import { ApiNonce, ApiRoles, LoadApiCredentialResult } from "./data"

export type LoadApiNonceInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
}>
export type LoadApiRolesInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
}>

export interface ApiCredentialRepository {
    findApiNonce(): LoadApiCredentialResult<ApiNonce>
    findApiRoles(): LoadApiCredentialResult<ApiRoles>
}
