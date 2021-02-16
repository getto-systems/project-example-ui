import { ClearAuthnInfoInfra } from "./infra"

import { ClearAuthnInfoMethod } from "./method"

interface Clear {
    (infra: ClearAuthnInfoInfra): ClearAuthnInfoMethod
}
export const clearAuthnInfo: Clear = (infra) => async (post) => {
    const { authnInfos } = infra
    const result = authnInfos.remove()
    if (!result.success) {
        post({ type: "failed-to-logout", err: result.err })
        return
    }
    post({ type: "succeed-to-logout" })
}
