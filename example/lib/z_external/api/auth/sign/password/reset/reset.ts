import { parseAuthResponse, parseErrorMessage } from "../../common"

import { ApiError, ApiResult } from "../../../../data"
import { AuthResponse, ParseErrorResult } from "../../data"

type SendMessage = Readonly<{
    resetToken: SendResetToken
    fields: Readonly<{
        loginID: SendLoginID
        password: SendPassword
    }>
}>
type SendResetToken = string
type SendLoginID = string
type SendPassword = string
type RawResetResult = ApiResult<AuthResponse, RemoteError>
type RemoteError =
    | ApiError
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "already-reset" }>
    | Readonly<{ type: "bad-request" }>

interface Reset {
    (message: SendMessage): Promise<RawResetResult>
}
export function newApi_ResetPassword(apiServerURL: string): Reset {
    return async (_message: SendMessage): Promise<RawResetResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "Reset"]],
            // TODO body を適切に送信する
        })

        if (response.ok) {
            return parseAuthResponse(response)
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
            case "already-reset":
                return { type: result.message }

            default:
                return { type: "server-error" }
        }
    }
}
