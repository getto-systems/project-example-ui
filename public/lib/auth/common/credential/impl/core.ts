import { StoreInfra } from "../infra"

import { LoadLastLogin, RemoveAuthCredential, StoreAuthCredential } from "../action"

export const loadLastLogin = (infra: StoreInfra): LoadLastLogin => () => () => {
    const { authCredentials } = infra
    return authCredentials.findLastLogin()
}

export const storeAuthCredential = (infra: StoreInfra): StoreAuthCredential => () => (authCredential) => {
    const { authCredentials } = infra
    return authCredentials.storeAuthCredential(authCredential)
}

export const removeAuthCredential = (infra: StoreInfra): RemoveAuthCredential => () => () => {
    const { authCredentials } = infra
    return authCredentials.removeAuthCredential()
}
