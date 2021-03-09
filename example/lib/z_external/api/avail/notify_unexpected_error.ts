import { ApiResult } from "../data"

type Message = Readonly<{ nonce: string; err: unknown }>
type NotifyResult = ApiResult<true, NotifyError>
type NotifyError = Readonly<{ type: "infra-error"; err: string }>

interface Notify {
    (message: Message): Promise<NotifyResult>
}
export function newApi_NotifyUnexpectedError(apiServerURL: string): Notify {
    return async (message: Message): Promise<NotifyResult> => {
        // TODO ちゃんとしたところに送る
        await fetch(apiServerURL, {
            method: "POST",
            headers: [
                ["Content-Type", "application/json"],
                ["X-GETTO-EXAMPLE-ID-AUTHZ-NONCE", message.nonce],
            ],
            body: JSON.stringify(message.err),
        })
        return { success: true, value: true }
    }
}
