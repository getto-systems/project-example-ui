import { ApiCredentialMessage } from "../y_protobuf/credential_pb.js"

import { decodeBase64StringToUint8Array } from "../../../z_vendor/protobufUtil"
import { RawRemoteAccessResult, RemoteAccessError } from "../../../z_infra/remote/infra.js"

export interface ApiAuthRenew {
    (nonce: SendTicketNonce): Promise<RawRenewResult>
}

type SendTicketNonce = string
type RawRenewResult = RawRemoteAccessResult<RawAuthCredential>

type RawAuthCredential = Readonly<{ ticketNonce: string; apiCredential: RawApiCredential }>
type RawApiCredential = Readonly<{ apiRoles: string[] }>

export function initApiAuthRenew(authServerURL: string): ApiAuthRenew {
    return async (nonce: SendTicketNonce): Promise<RawRenewResult> => {
        const response = await fetch(authServerURL, {
            method: "POST",
            credentials: "include",
            headers: [
                ["X-GETTO-EXAMPLE-ID-HANDLER", "Renew"],
                ["X-GETTO-EXAMPLE-ID-TICKET-NONCE", nonce],
            ],
        })

        if (response.ok) {
            return parseSuccessResponse(response)
        } else {
            return { success: false, err: await parseErrorResponse(response) }
        }
    }
}

async function parseSuccessResponse(response: Response): Promise<RawRenewResult> {
    try {
        const nonce = getHeader("X-GETTO-EXAMPLE-ID-TICKET-NONCE")
        const credential = getHeader("X-GETTO-EXAMPLE-ID-API-CREDENTIAL")

        const result = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(credential))

        return { success: true, value: { ticketNonce: nonce, apiCredential: apiCredential(result) } }
    } catch (err) {
        return { success: false, err: { type: "bad-response", detail: `${err}` } }
    }

    function getHeader(header: string) {
        const value = response.headers.get(header)
        if (!value) {
            throw `${header} is empty`
        }
        return value
    }
    function apiCredential(result: ApiCredentialMessage): RawApiCredential {
        return {
            apiRoles: result.roles || [],
        }
    }
}

async function parseErrorResponse(response: Response): Promise<RemoteAccessError> {
    // TODO エラーも protobuf にしよう
    const result = await parseMessage(response)
    if (!result.success) {
        return { type: "bad-response", detail: result.err }
    }
    return { type: result.message || "server-error", detail: "" }

    async function parseMessage(response: Response) {
        try {
            const json = await response.json()
            return { success: true as const, message: json.message }
        } catch (err) {
            return { success: false as const, err: `${err}` }
        }
    }
}
