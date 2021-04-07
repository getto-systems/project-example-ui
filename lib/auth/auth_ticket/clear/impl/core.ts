import { passThroughRemoteValue } from "../../../../z_vendor/getto-application/infra/remote/helper"
import { authzRepositoryConverter } from "../../kernel/converter"
import { authnRepositoryConverter } from "../../kernel/converter"

import { StoreRepositoryResult } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { ClearAuthTicketInfra } from "../infra"

import { ClearAuthTicketMethod } from "../method"
import { ClearAuthTicketEvent } from "../event"

interface Clear {
    (infra: ClearAuthTicketInfra): ClearAuthTicketMethod
}
export const clearAuthTicket: Clear = (infra) => async (post) => {
    const authn = infra.authn(authnRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)
    const clear = infra.clear(passThroughRemoteValue)

    const authnResult = await authn.get()
    if (!authnResult.success) {
        post({ type: "failed-to-logout", err: authnResult.err })
        return
    }
    if (!authnResult.found) {
        // authn が保存されていなければ authz のクリアだけ行う
        if (!handleResult(await authz.remove())) {
            return
        }

        post({ type: "succeed-to-logout" })
        return
    }

    const clearResponse = await clear({ type: "always" })
    if (!clearResponse.success) {
        post({ type: "failed-to-clear", err: clearResponse.err })
        return
    }

    if (!handleResult(await authn.remove()) || !handleResult(await authz.remove())) {
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

export function clearAuthTicketEventHasDone(_event: ClearAuthTicketEvent): boolean {
    return true
}
