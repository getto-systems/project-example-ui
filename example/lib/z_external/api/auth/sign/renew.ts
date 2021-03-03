import { parseAuthResponse, parseErrorMessage } from "./common"

import { AuthResponse, ParseErrorResult } from "./data"
import { ApiError, ApiResult } from "../../data"

type SendAuthnNonce = string
type RemoteResult = ApiResult<AuthResponse, RemoteError>
type RemoteError =
    | ApiError
    | Readonly<{ type: "invalid-ticket" }>
    | Readonly<{ type: "bad-request" }>

interface Renew {
    (apiServerURL: string): { (nonce: SendAuthnNonce): Promise<RemoteResult> }
}
export const newApi_Renew: Renew = (apiServerURL) => async (nonce) => {
    const response = await fetch(apiServerURL, {
        method: "POST",
        credentials: "include",
        headers: [
            ["X-GETTO-EXAMPLE-ID-HANDLER", "Renew"],
            // TODO AUTHN-NONCE にしたい
            ["X-GETTO-EXAMPLE-ID-TICKET-NONCE", nonce],
        ],
    })

    if (response.ok) {
        return parseAuthResponse(response)
    } else {
        return { success: false, err: toRemoteError(await parseErrorMessage(response)) }
    }

    function toRemoteError(result: ParseErrorResult): RemoteError {
        if (!result.success) {
            return { type: "bad-response", err: result.err }
        }
        switch (result.message) {
            case "bad-request":
            case "invalid-ticket":
                return { type: result.message }

            default:
                return { type: "server-error" }
        }
    }
}
