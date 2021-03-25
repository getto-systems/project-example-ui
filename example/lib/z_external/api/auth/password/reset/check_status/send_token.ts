import { ApiCommonError, ApiResult } from "../../../../data"
import { parseErrorMessage } from "../../../common"
import { ParseErrorResult } from "../../../data"

type RawSendTokenResult = ApiResult<true, RemoteError>
type RemoteError = ApiCommonError

interface SendToken {
    (): Promise<RawSendTokenResult>
}
export function newApi_SendResetToken(apiServerURL: string): SendToken {
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
                return { type: result.message }

            default:
                return { type: "server-error" }
        }
    }
}
