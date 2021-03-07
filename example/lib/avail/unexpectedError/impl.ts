import { passThroughRemoteValue } from "../../z_vendor/getto-application/infra/remote/helper"
import { authzRepositoryConverter } from "../../common/authz/convert"

import { NotifyUnexpectedErrorInfra } from "./infra"

import { NotifyUnexpectedErrorMethod } from "./method"

interface Notify {
    (infra: NotifyUnexpectedErrorInfra): NotifyUnexpectedErrorMethod
}
export const notifyUnexpectedError: Notify = (infra) => async (err) => {
    const authz = infra.authz(authzRepositoryConverter)
    const notify = infra.notify(passThroughRemoteValue)

    const authzResult = authz.get()
    if (!authzResult.success) {
        // ここはエラーの行きつく先なので、発生したエラーはどうしようもない
        console.log(authzResult.err)
        return
    }
    if (!authzResult.found) {
        // 認証していないならエラーはどうしようもない
        console.log(err)
        return
    }

    const result = await notify({
        nonce: authzResult.value.nonce,
        err,
    })
    if (!result.success) {
        // エラーの通知に失敗したらもうどうしようもないので console.log しておく
        console.log(result.err)
    }
}
