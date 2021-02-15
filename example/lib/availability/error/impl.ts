import { ErrorAction } from "./action"
import { ErrorInfra, Notify } from "./infra"

export function initErrorAction(infra: ErrorInfra): ErrorAction {
    return {
        notify: notify(infra)(),
    }
}

const notify: Notify = (infra) => () => async (err) => {
    const { notify } = infra
    const result = await notify(err)
    if (!result.success) {
        // エラーの通知に失敗したらもうどうしようもないので console.log しておく
        console.log(result.err)
    }
}
