import { ApiAccessResult, ApiError } from "../../../../data"
import { parseError } from "../../common"

type SendFields = Readonly<{
    loginID: SendLoginID
}>
type SendLoginID = string
type RemoteResult = ApiAccessResult<string, RemoteError>
type RemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

interface RequestToken {
    (fields: SendFields): Promise<RemoteResult>
}
export function newApiRequestToken(apiServerURL: string): RequestToken {
    return async (_fields: SendFields): Promise<RemoteResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "ResetSession-Start"]],
            // TODO body を適切に送信する
        })

        if (response.ok) {
            // TODO 適切にデコードする
            return { success: true, value: "session-id" }
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
