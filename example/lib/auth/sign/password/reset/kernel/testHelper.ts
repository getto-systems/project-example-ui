import { ResetSessionID, ResetToken } from "./data"

export function markResetSessionID(sessionID: string): ResetSessionID {
    return sessionID as ResetSessionID
}

export function markResetToken(resetToken: string): ResetToken {
    return resetToken as ResetToken
}
