export type ResetSessionID = string & { ResetSessionID: never }
export type ResetToken = string & { ResetToken: never }
export function markResetToken(resetToken: string): ResetToken {
    return resetToken as ResetToken
}
