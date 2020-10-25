import { SessionID, ResetToken } from "./data"

export function packSessionID(sessionID: string): SessionID {
    return sessionID as SessionID & string
}

export function unpackSessionID(sessionID: SessionID): string {
    return (sessionID as unknown) as string
}

export function packResetToken(resetToken: string): ResetToken {
    return resetToken as ResetToken & string
}

export function unpackResetToken(resetToken: ResetToken): string {
    return (resetToken as unknown) as string
}
