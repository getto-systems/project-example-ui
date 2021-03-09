import { ApiResult } from "../../../../data"
import { parseErrorMessage } from "../../common"
import { ParseErrorResult } from "../../data"

type SendFields = Readonly<{
    loginID: SendLoginID
}>
type SendLoginID = string
type RemoteResult = ApiResult<string, RemoteError>
type RemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

interface RequestToken {
    (fields: SendFields): Promise<RemoteResult>
}
export function newApi_RequestToken(apiServerURL: string): RequestToken {
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
