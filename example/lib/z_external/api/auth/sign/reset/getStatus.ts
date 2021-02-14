import { ApiResult } from "../../../data"
import { parseError } from "../common"

export interface ApiAuthSignResetGetStatus {
    (sessionID: SendSessionID): Promise<RawGetStatusResult>
}

type SendSessionID = string
type RawGetStatusResult = ApiResult<SessionStatus>
type SessionStatus =
    | Readonly<{ dest: RawDestination; done: false; status: SendingStatus }>
    | Readonly<{ dest: RawDestination; done: true; send: false; err: string }>
    | Readonly<{ dest: RawDestination; done: true; send: true }>

type RawDestination = Readonly<{ type: "log" }>
type SendingStatus = Readonly<{ sending: boolean }>

export function initApiAuthSignResetGetStatus(apiServerURL: string): ApiAuthSignResetGetStatus {
    return async (_sessionID: SendSessionID): Promise<RawGetStatusResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [["X-GETTO-EXAMPLE-ID-HANDLER", "ResetSession-GetStatus"]],
            // TODO body を適切に送信する
        })

        if (response.ok) {
            // TODO 適切にデコードする
            return {
                success: true,
                value: {
                    dest: { type: "log" },
                    done: true,
                    send: true,
                },
            }
        } else {
            return { success: false, err: await parseError(response) }
        }
    }
}
