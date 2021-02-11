import { NotifyInfra } from "../infra"

import { NotifyPod } from "../action"

export const notify = ({ notify }: NotifyInfra): NotifyPod => () => async (err) => {
    const result = await notify(err)
    if (!result.success) {
        // エラーの通知に失敗したらもうどうしようもないので console.log しておく
        console.log(result.err)
    }
}
