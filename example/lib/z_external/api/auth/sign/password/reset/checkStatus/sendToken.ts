import { ApiAccessResult, ApiError } from "../../../../../data"
import { parseError } from "../../../common"

type RawSendTokenResult = ApiAccessResult<true, RemoteError>
type RemoteError =
    | Readonly<{ type: "empty-session-id" }>
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
