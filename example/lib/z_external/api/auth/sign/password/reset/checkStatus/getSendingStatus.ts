import { ApiAccessResult, ApiError } from "../../../../../data"
import { parseError } from "../../../common"

type SendSessionID = string
type RemoteResult = ApiAccessResult<SendingTokenStatus, RemoteError>
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
            return { success: false, err: toRemoteError(await parseError(response)) }
        }
    }

    function toRemoteError(err: ApiError): RemoteError {
        switch (err.type) {
            case "bad-request":
            case "invalid-password-reset":
            case "server-error":
                return { type: err.type }

            case "bad-response":
                return { type: err.type, err: err.err }

            default:
                return { type: "infra-error", err: err.err }
        }
    }
}
