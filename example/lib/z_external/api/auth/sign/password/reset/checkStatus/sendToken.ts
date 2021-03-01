import { ApiResult } from "../../../../../data"
import { parseErrorMessage } from "../../../common"
import { ParseErrorResult } from "../../../data"

type RawSendTokenResult = ApiResult<true, RemoteError>
type RemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

interface SendToken {
    (): Promise<RawSendTokenResult>
}
export function newApiSendToken(apiServerURL: string): SendToken {
    return async (): Promise<RawSendTokenResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "ResetSession-SendToken"]],
        })

        if (response.ok) {
            return {
                success: true,
                value: true,
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
