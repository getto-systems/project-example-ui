import { PasswordLoginMessage } from "../../../y_protobuf/password_login_pb.js"

import { encodeUint8ArrayToBase64String } from "../../../../../z_vendor/protobufUtil"

import { parseAuthnInfo, parseError } from "../common"

import { RawAuthnInfo } from "../data"
import { ApiResult } from "../../../data"

export interface ApiAuthSignPasswordAuthenticate {
    (fields: LoginFields): Promise<LoginResult>
}

type LoginFields = Readonly<{ loginID: string; password: string }>
type LoginResult = ApiResult<RawAuthnInfo>

export function newApiAuthSignPasswordAuthenticate(
    apiServerURL: string
): ApiAuthSignPasswordAuthenticate {
    return async (fields: LoginFields): Promise<LoginResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "PasswordLogin"]],
            body: body(),
        })

        if (response.ok) {
            return parseAuthnInfo(response)
        } else {
            return { success: false, err: await parseError(response) }
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