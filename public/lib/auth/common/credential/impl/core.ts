import { StoreInfra } from "../infra"

import { LoadLastLoginPod, RemoveAuthCredentialPod, StoreAuthCredentialPod } from "../action"

export const loadLastLogin = (infra: StoreInfra): LoadLastLoginPod => () => () => {
    const { authCredentials } = infra
    return authCredentials.findLastLogin()
}

export const storeAuthCredential = (infra: StoreInfra): StoreAuthCredentialPod => () => (authCredential) => {
    const { authCredentials } = infra
    return authCredentials.storeAuthCredential(authCredential)
}

export const removeAuthCredential = (infra: StoreInfra): RemoveAuthCredentialPod => () => () => {
    const { authCredentials } = infra
    return authCredentials.removeAuthCredential()
}
