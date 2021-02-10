import { ApiCredentialMessage } from "../y_protobuf/credential_pb.js"
import { PasswordLoginMessage } from "../y_protobuf/password_login_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../z_vendor/protobufUtil"
import { RawRemoteAccessResult, RemoteAccessError } from "../../../z_infra/remote/infra.js"

export interface ApiAuthLogin {
    (fields: LoginFields): Promise<LoginResult>
}

type LoginFields = Readonly<{ loginID: string; password: string }>
type LoginResult = RawRemoteAccessResult<LoginResponse>

type LoginResponse = Readonly<{ ticketNonce: string; apiCredential: ApiCredentialResponse }>
type ApiCredentialResponse = Readonly<{ apiRoles: string[] }>

export function initApiAuthLogin(authServerURL: string): ApiAuthLogin {
    return async (fields: LoginFields): Promise<LoginResult> => {
        const response = await fetch(authServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "PasswordLogin"]],
            body: body(),
        })

        if (response.ok) {
            return parseSuccessResponse(response)
        } else {
            return { success: false, err: await parseErrorResponse(response) }
        }

        function body() {
            const f = PasswordLoginMessage
            const passwordLogin = new f()

            passwordLogin.loginId = fields.loginID
            passwordLogin.password = fields.password

            const arr = f.encode(passwordLogin).finish()
            return encodeUint8ArrayToBase64String(arr)
        }
    }
}

async function parseSuccessResponse(response: Response): Promise<LoginResult> {
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
    function apiCredential(result: ApiCredentialMessage): ApiCredentialResponse {
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
