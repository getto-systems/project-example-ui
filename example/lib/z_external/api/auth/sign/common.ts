import { ApiCredentialMessage } from "../../y_protobuf/credential_pb.js"

import { decodeBase64StringToUint8Array } from "../../../../z_vendor/base64/transform"

import { AuthResponse, ParseErrorResult } from "./data"
import { ApiError, ApiResult } from "../../data"

export async function parseAuthResponse(
    response: Response,
): Promise<ApiResult<AuthResponse, ApiError>> {
    try {
        // TODO AUTHN-NONCE にしたい
        const nonce = getHeader("X-GETTO-EXAMPLE-ID-TICKET-NONCE")
        const credential = getHeader("X-GETTO-EXAMPLE-ID-API-CREDENTIAL")

        const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(credential))

        return {
            success: true,
            value: {
                authn: { nonce },
                authz: {
                    nonce: message.nonce || "",
                    roles: message.roles || [],                
                },
            },
        }
    } catch (err) {
        return { success: false, err: { type: "bad-response", err: `${err}` } }
    }

    function getHeader(header: string) {
        const value = response.headers.get(header)
        if (!value) {
            throw `${header} is empty`
        }
        return value
    }
}

export async function parseAuthResponse_legacy(
    response: Response,
): Promise<ApiResult<AuthResponse, RawError>> {
    try {
        // TODO AUTHN-NONCE にしたい
        const nonce = getHeader("X-GETTO-EXAMPLE-ID-TICKET-NONCE")
        const credential = getHeader("X-GETTO-EXAMPLE-ID-API-CREDENTIAL")

        const result = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(credential))

        return {
            success: true,
            value: { authn: { nonce }, authz: result },
        }
    } catch (err) {
        return { success: false, err: { type: "bad-response", err: `${err}` } }
    }

    function getHeader(header: string) {
        const value = response.headers.get(header)
        if (!value) {
            throw `${header} is empty`
        }
        return value
    }
}

export async function parseError(response: Response): Promise<RawError> {
    // TODO エラーも protobuf にしよう
    const result = await parseMessage(response)
    if (!result.success) {
        return { type: "bad-response", err: result.err }
    }
    switch (result.message) {
        case "invalid-ticket":
        case "bad-request":
            return { type: result.message, err: "" }

        default:
            return { type: "server-error", err: "" }
    }

    async function parseMessage(response: Response) {
        try {
            const json = await response.json()
            return { success: true as const, message: json.message }
        } catch (err) {
            return { success: false as const, err: `${err}` }
        }
    }
}
export async function parseErrorMessage(response: Response): Promise<ParseErrorResult> {
    try {
        const json = await response.json()
        return { success: true, message: json.message }
    } catch (err) {
        return { success: false, err: `${err}` }
    }
}

type RawError = Readonly<{ type: string; err: string }>
