import { ClearInfra } from "./infra"

import { ClearMethod } from "./method"

interface Clear {
    (infra: ClearInfra): ClearMethod
}
export const clear: Clear = (infra) => async (post) => {
    const { authnInfos } = infra
    const result = authnInfos.remove()
    if (!result.success) {
        post({ type: "failed-to-logout", err: result.err })
        return
    }
    post({ type: "succeed-to-logout" })
}
