import { ConvertLocationResult } from "../../../../../z_vendor/getto-application/location/detecter"
import { ResetSessionID } from "./data"

export function sessionIDLocationConverter(
    sessionID: string | null,
): ConvertLocationResult<ResetSessionID> {
    if (sessionID === null) {
        return { valid: false }
    }
    if (sessionID.length === 0) {
        return { valid: false }
    }
    return { valid: true, value: markResetSessionID(sessionID) }
}

export function sessionIDRemoteConverter(sessionID: string): ResetSessionID {
    // remote からの値は validation チェックなしで受け入れる
    return markResetSessionID(sessionID)
}

function markResetSessionID(sessionID: string): ResetSessionID {
    return sessionID as ResetSessionID
}
