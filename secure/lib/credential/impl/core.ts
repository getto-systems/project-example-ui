import { LoadApiNonce, LoadApiRoles } from "../action"
import { LoadApiNonceInfra, LoadApiRolesInfra } from "../infra"

export const loadApiNonce = (infra: LoadApiNonceInfra): LoadApiNonce => () => () => {
    const { apiCredentials } = infra
    return apiCredentials.findApiNonce()
}

export const loadApiRoles = (infra: LoadApiRolesInfra): LoadApiRoles => () => () => {
    const { apiCredentials } = infra
    return apiCredentials.findApiRoles()
}
