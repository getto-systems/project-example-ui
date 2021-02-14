import { ApiResult } from "../../../data"
import { parseError } from "../common"

export interface ApiAuthSignResetStartSession {
    (fields: SendFields): Promise<RawStartSessionResult>
}

type SendFields = Readonly<{
    loginID: SendLoginID
}>
type SendLoginID = string
type RawStartSessionResult = ApiResult<string>

export function initApiAuthSignResetStartSession(apiServerURL: string): ApiAuthSignResetStartSession {
    return async (_fields: SendFields): Promise<RawStartSessionResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "ResetSession-Start"]],
            // TODO body を適切に送信する
        })

        if (response.ok) {
            // TODO 適切にデコードする
            return { success: true, value: "session-id" }
        } else {
            return { success: false, err: await parseError(response) }
        }
    }
}
