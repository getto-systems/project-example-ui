import { ApiCredentialMessage } from "../../y_protobuf/credential_pb.js"

import { decodeBase64StringToUint8Array } from "../../../../z_vendor/protobufUtil"

import { ApiError, ApiResult } from "../../data"
import { RawApiCredential, RawAuthnInfo } from "./data"

export async function parseAuthnInfo(
    response: Response
): Promise<ApiResult<RawAuthnInfo>> {
    try {
        // TODO AUTHN-NONCE にしたい
        const nonce = getHeader("X-GETTO-EXAMPLE-ID-TICKET-NONCE")
        const credential = getHeader("X-GETTO-EXAMPLE-ID-API-CREDENTIAL")

        const result = ApiCredentialMessage.decode(
            decodeBase64StringToUint8Array(credential)
        )

        return {
            success: true,
            value: { authnNonce: nonce, api: apiCredential(result) },
        }
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
            apiNonce: result.nonce || "",
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
