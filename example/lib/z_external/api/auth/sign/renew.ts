import { parseAuthnInfo, parseError } from "./common"

import { RawAuthnInfo } from "./data"
import { ApiResult } from "../../data"

export interface ApiAuthSignRenew {
    (nonce: SendAuthnNonce): Promise<RawRenewResult>
}

type SendAuthnNonce = string
type RawRenewResult = ApiResult<RawAuthnInfo>

export function newApiAuthSignRenew(apiServerURL: string): ApiAuthSignRenew {
    return async (nonce: SendAuthnNonce): Promise<RawRenewResult> => {
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
            return parseAuthnInfo(response)
        } else {
            return { success: false, err: await parseError(response) }
        }
    }
}
