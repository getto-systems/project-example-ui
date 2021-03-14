import { authzRepositoryConverter } from "../../kernel/converter"
import { StoreRepositoryResult } from "../../../../../../z_vendor/getto-application/infra/repository/infra"
import { authnRepositoryConverter } from "../../kernel/converter"
import { ClearAuthInfoInfra } from "../infra"

import { ClearAuthInfoMethod } from "../method"

interface Clear {
    (infra: ClearAuthInfoInfra): ClearAuthInfoMethod
}
export const clearAuthInfo: Clear = (infra) => async (post) => {
    const authn = infra.authn(authnRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)

    if (!handleResult(authn.remove()) || !handleResult(authz.remove())) {
        return
    }

    post({ type: "succeed-to-logout" })

    function handleResult(result: StoreRepositoryResult): boolean {
        if (!result.success) {
            post({ type: "failed-to-logout", err: result.err })
        }
        return result.success
    }
}
