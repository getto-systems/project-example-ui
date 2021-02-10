import { ApiCredentialMessage } from "../y_protobuf/credential_pb.js"

import { decodeBase64StringToUint8Array } from "../../../z_vendor/protobufUtil"

import { ApiError, ApiResult } from "../data"
import { RawApiCredential, RawAuthCredential } from "./data"

export async function parseAuthCredential(response: Response): Promise<ApiResult<RawAuthCredential>> {
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

export async function parseError(response: Response): Promise<ApiError> {
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
