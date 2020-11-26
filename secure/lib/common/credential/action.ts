import { ApiNonce, ApiRoles, LoadResult } from "./data"

export interface LoadApiNonce {
    (): LoadApiNonceAction
}
export interface LoadApiNonceAction {
    (): LoadResult<ApiNonce>
}

export interface LoadApiRoles {
    (): LoadApiRolesAction
}
export interface LoadApiRolesAction {
    (): LoadResult<ApiRoles>
}
