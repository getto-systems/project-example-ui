import { parseAuthResponse, parseErrorMessage } from "../common"

import { AuthResponse, ParseErrorResult } from "../data"
import { ApiCommonError, ApiResult } from "../../data"

type SendAuthnNonce = string
type RemoteResult = ApiResult<AuthResponse, RemoteError>
type RemoteError = ApiCommonError | Readonly<{ type: "invalid-ticket" }>

interface Renew {
    (apiServerURL: string): { (nonce: SendAuthnNonce): Promise<RemoteResult> }
}
export const newApi_RenewAuthTicket: Renew = (apiServerURL) => async (nonce) => {
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
