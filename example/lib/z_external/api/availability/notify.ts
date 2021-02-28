import { ApiAccessResult } from "../data"

type SendError = unknown
type NotifyResult = ApiAccessResult<true, NotifyError>
type NotifyError = Readonly<{ type: "infra-error"; err: string }>

interface Notify {
    (err: SendError): Promise<NotifyResult>
}
export function initApiAvailableNotify(apiServerURL: string): Notify {
    return async (err: SendError): Promise<NotifyResult> => {
        // TODO ちゃんとしたところに送る
        await fetch(apiServerURL, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify(err),
        })
        return { success: true, value: true }
    }
}
