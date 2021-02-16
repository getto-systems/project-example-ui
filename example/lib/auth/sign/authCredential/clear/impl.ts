import { ClearAuthCredentialInfra } from "./infra"

import { ClearAuthCredentialMethod } from "./method"

interface Clear {
    (infra: ClearAuthCredentialInfra): ClearAuthCredentialMethod
}
export const clearAuthCredential: Clear = (infra) => async (post) => {
    const { authCredentials } = infra
    const result = authCredentials.remove()
    if (!result.success) {
        post({ type: "failed-to-logout", err: result.err })
        return
    }
    post({ type: "succeed-to-logout" })
}
