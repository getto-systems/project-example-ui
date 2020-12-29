import { LoadApiNoncePod, LoadApiRolesPod } from "../action"
import { LoadApiNonceInfra, LoadApiRolesInfra } from "../infra"

export const loadApiNonce = (infra: LoadApiNonceInfra): LoadApiNoncePod => () => () => {
    const { apiCredentials } = infra
    return apiCredentials.findApiNonce()
}

export const loadApiRoles = (infra: LoadApiRolesInfra): LoadApiRolesPod => () => () => {
    const { apiCredentials } = infra
    return apiCredentials.findApiRoles()
}
