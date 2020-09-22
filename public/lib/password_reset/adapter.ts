import { SessionID, ResetToken } from "./data"

export function initSessionID(sessionID: string): SessionID {
    return sessionID as string & SessionID
}

export function sessionIDToString(sessionID: SessionID): string {
    return sessionID as unknown as string
}


export function initResetToken(resetToken: string): ResetToken {
    return resetToken as string & ResetToken
}

export function resetTokenToString(resetToken: ResetToken): string {
    return resetToken as unknown as string
}
