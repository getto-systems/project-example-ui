import { authzRepositoryConverter } from "../../../../../common/authz/convert"
import { RepositoryStoreResult } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { lastAuthRepositoryConverter } from "../kernel/convert"
import { ClearInfra } from "./infra"

import { ClearMethod } from "./method"

interface Clear {
    (infra: ClearInfra): ClearMethod
}
export const clear: Clear = (infra) => async (post) => {
    const lastAuth = infra.lastAuth(lastAuthRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)

    if (!handleResult(lastAuth.remove()) || !handleResult(authz.remove())) {
        return
    }

    post({ type: "succeed-to-logout" })

    function handleResult(result: RepositoryStoreResult): boolean {
        if (!result.success) {
            post({ type: "failed-to-logout", err: result.err })
        }
        return result.success
    }
}
