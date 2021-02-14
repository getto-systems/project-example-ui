import { ApiResult } from "../../../data"
import { parseError } from "../common"

export interface ApiAuthSignResetSendToken {
    (): Promise<RawSendTokenResult>
}

type RawSendTokenResult = ApiResult<true>

export function initApiAuthSignResetSendToken(apiServerURL: string): ApiAuthSignResetSendToken {
    return async (): Promise<RawSendTokenResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "ResetSession-SendToken"]],
        })

        if (response.ok) {
            return {
                success: true,
                value: true,
            }
        } else {
            return { success: false, err: await parseError(response) }
        }
    }
}
