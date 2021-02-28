import { ConvertLocationResult } from "../../../../../z_vendor/getto-application/location/data"

export type ResetSessionID = string & { ResetSessionID: never }
function markResetSessionID(sessionID: string): ResetSessionID {
    return sessionID as ResetSessionID
}

export function convertResetSessionIDFromLocation(
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
export function convertResetSessionIDFromRemoteValue(sessionID: string): ResetSessionID {
    // remote からの値は validation チェックなしで受け入れる
    return markResetSessionID(sessionID)
}

export type ResetToken = string & { ResetToken: never }
export function markResetToken(resetToken: string): ResetToken {
    return resetToken as ResetToken
}
