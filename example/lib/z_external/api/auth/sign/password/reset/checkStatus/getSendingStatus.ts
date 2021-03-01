import { ApiResult } from "../../../../../data"
import { parseErrorMessage } from "../../../common"
import { ParseErrorResult } from "../../../data"

type SendSessionID = string
type RemoteResult = ApiResult<SendingTokenStatus, RemoteError>
type SendingTokenStatus =
    | Readonly<{ done: false; status: Readonly<{ sending: boolean }> }>
    | Readonly<{ done: true; send: false; err: string }>
    | Readonly<{ done: true; send: true }>

type RemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

interface GetSendingStatus {
    (sessionID: SendSessionID): Promise<RemoteResult>
}
export function newApiGetSendingStatus(apiServerURL: string): GetSendingStatus {
    return async (_sessionID: SendSessionID): Promise<RemoteResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "ResetSession-GetStatus"]],
            // TODO body を適切に送信する
        })

        if (response.ok) {
            // TODO 適切にデコードする
            return {
                success: true,
                value: {
                    done: true,
                    send: true,
                },
            }
        } else {
            return { success: false, err: toRemoteError(await parseErrorMessage(response)) }
        }
    }

    function toRemoteError(result: ParseErrorResult): RemoteError {
        if (!result.success) {
            return { type: "bad-response", err: result.err }
        }
        switch (result.message) {
            case "bad-request":
            case "invalid-password-reset":
                return { type: result.message }

            default:
                return { type: "server-error" }
        }
    }
}
