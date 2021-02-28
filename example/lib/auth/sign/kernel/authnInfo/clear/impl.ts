import { ClearInfra } from "./infra"

import { ClearMethod } from "./method"

interface Clear {
    (infra: ClearInfra): ClearMethod
}
export const clear: Clear = (infra) => async (post) => {
    const { authnInfos, authz } = infra

    const authnResult = authnInfos.remove()
    const authzResult = authz.remove()

    if (!authnResult.success) {
        post({ type: "failed-to-logout", err: authnResult.err })
        return
    }
    if (!authzResult.success) {
        post({ type: "failed-to-logout", err: authzResult.err })
        return
    }

    post({ type: "succeed-to-logout" })
}
