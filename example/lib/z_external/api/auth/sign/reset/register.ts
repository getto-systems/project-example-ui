import { ApiResult } from "../../../data"
import { parseAuthCredential, parseError } from "../common"
import { RawAuthCredential } from "../data"

export interface ApiAuthSignResetRegister {
    (message: SendMessage): Promise<RawResetResult>
}

type SendMessage = Readonly<{
    resetToken: SendResetToken
    fields: Readonly<{
        loginID: SendLoginID
        password: SendPassword
    }>
}>
type SendResetToken = string
type SendLoginID = string
type SendPassword = string
type RawResetResult = ApiResult<RawAuthCredential>

export function initApiAuthSignResetRegister(apiServerURL: string): ApiAuthSignResetRegister {
    return async (_message: SendMessage): Promise<RawResetResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [
                ["X-GETTO-EXAMPLE-ID-HANDLER", "Reset"],
            ],
            // TODO body を適切に送信する
        })

        if (response.ok) {
            return parseAuthCredential(response)
        } else {
            return { success: false, err: await parseError(response) }
        }
    }
}
