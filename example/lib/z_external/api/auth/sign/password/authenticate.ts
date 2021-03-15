import { PasswordLoginMessage } from "../../../y_protobuf/password_login_pb.js"

import { encodeUint8ArrayToBase64String } from "../../../../../z_vendor/base64/transform"

import { parseAuthResponse, parseErrorMessage } from "../common"

import { AuthResponse, ParseErrorResult } from "../data"
import { ApiCommonError, ApiResult } from "../../../data"

type LoginFields = Readonly<{ loginID: string; password: string }>
type LoginResult = ApiResult<AuthResponse, RemoteError>
type RemoteError = ApiCommonError | Readonly<{ type: "invalid-password-login" }>

interface Authenticate {
    (fields: LoginFields): Promise<LoginResult>
}
export function newApi_AuthenticatePassword(apiServerURL: string): Authenticate {
    return async (fields: LoginFields): Promise<LoginResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "PasswordLogin"]],
            body: body(),
        })

        if (response.ok) {
            return parseAuthResponse(response)
        } else {
            return { success: false, err: toRemoteError(await parseErrorMessage(response)) }
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

    function toRemoteError(result: ParseErrorResult): RemoteError {
        if (!result.success) {
            return { type: "bad-response", err: result.err }
        }
        switch (result.message) {
            case "bad-request":
            case "invalid-password-login":
                return { type: result.message }

            default:
                return { type: "server-error" }
        }
    }
}
