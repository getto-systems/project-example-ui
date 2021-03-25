import { ApiCommonError, ApiResult } from "../../data"

type SendAuthnNonce = string
type ClearResult = ApiResult<true, RemoteError>
type RemoteError = ApiCommonError

interface Renew {
    (apiServerURL: string): { (nonce: SendAuthnNonce): Promise<ClearResult> }
}
export const newApi_ClearAuthTicket: Renew = (_apiServerURL) => async (_nonce) => {
    // TODO ちゃんと投げる
    return { success: true, value: true }
    // const response = await fetch(apiServerURL, {
    //     method: "POST",
    //     credentials: "include",
    //     headers: [
    //         ["X-GETTO-EXAMPLE-ID-HANDLER", "Clear"],
    //         // TODO AUTHN-NONCE にしたい
    //         ["X-GETTO-EXAMPLE-ID-TICKET-NONCE", nonce],
    //     ],
    // })

    // if (response.ok) {
    //     return { success: true, value: true }
    // } else {
    //     return { success: false, err: toRemoteError(await parseErrorMessage(response)) }
    // }

    // function toRemoteError(result: ParseErrorResult): RemoteError {
    //     if (!result.success) {
    //         return { type: "bad-response", err: result.err }
    //     }
    //     switch (result.message) {
    //         case "bad-request":
    //         case "invalid-ticket":
    //             return { type: result.message }

    //         default:
    //             return { type: "server-error" }
    //     }
    // }
}
