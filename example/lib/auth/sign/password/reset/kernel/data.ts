export type ResetSessionID = string & { ResetSessionID: never }
export function markResetSessionID(sessionID: string): ResetSessionID {
    return sessionID as ResetSessionID
}

export type ResetToken = string & { ResetToken: never }
export function markResetToken(resetToken: string): ResetToken {
    return resetToken as ResetToken
}
