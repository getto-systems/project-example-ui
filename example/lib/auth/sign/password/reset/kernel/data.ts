export type PasswordResetSessionID = string & { PasswordResetSessionID: never }
export function markPasswordResetSessionID(sessionID: string): PasswordResetSessionID {
    return sessionID as PasswordResetSessionID
}

export type PasswordResetToken = string & { PasswordResetToken: never }
export function markPasswordResetToken(resetToken: string): PasswordResetToken {
    return resetToken as PasswordResetToken
}
