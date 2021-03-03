import { passThroughRemoteConverter } from "../../z_vendor/getto-application/infra/remote/helper"
import { UnexpectedErrorAction } from "./action"
import { UnexpectedErrorInfra, NotifyUnexpectedError } from "./infra"

export function initUnexpectedErrorAction(infra: UnexpectedErrorInfra): UnexpectedErrorAction {
    return {
        notifyUnexpectedError: notify(infra)(),
    }
}

const notify: NotifyUnexpectedError = (infra) => () => async (err) => {
    const notify = infra.notify(passThroughRemoteConverter)
    const result = await notify(err)
    if (!result.success) {
        // エラーの通知に失敗したらもうどうしようもないので console.log しておく
        console.log(result.err)
    }
}
