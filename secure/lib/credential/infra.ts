import { ApiNonce, ApiRoles, LoadResult } from "./data"

export type LoadApiNonceInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
}>
export type LoadApiRolesInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
}>

export interface ApiCredentialRepository {
    findApiNonce(): LoadResult<ApiNonce>
    findApiRoles(): LoadResult<ApiRoles>
}
