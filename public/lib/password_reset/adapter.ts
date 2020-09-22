import { SessionID, ResetToken } from "./data"

export function initSessionID(sessionID: string): SessionID {
    return sessionID as _SessionID
}

export function sessionIDToString(sessionID: SessionID): string {
    return sessionID as unknown as string
}

type _SessionID = string & SessionID


export function initResetToken(resetToken: string): ResetToken {
    return resetToken as _ResetToken
}

export function resetTokenToString(resetToken: ResetToken): string {
    return resetToken as unknown as string
}

type _ResetToken = string & ResetToken
