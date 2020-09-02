import { LoginID, LoginIDValidationError, NonceValue, ApiRoles } from "../credential/data";

export type Session = Readonly<{ sessionID: Readonly<string> }>
export type ResetToken = Readonly<{ token: Readonly<string> }>

export type ResetBoard = Readonly<{ loginID: LoginIDBoard }>

export type LoginIDBoard =
    Readonly<{ err: Array<LoginIDValidationError> }>

export type ResetBoardContent =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, loginID: LoginID }>
export const invalidResetBoardContent: ResetBoardContent = { valid: false }
export function validResetBoardContent(loginID: LoginID): ResetBoardContent {
    return { valid: true, loginID }
}

// TODO log 以外にも対応
export type Destination =
    Readonly<{ type: "log" }>

// TODO since と at を時間型にしたい
export type PollingStatus =
    Readonly<{ sending: false, since: string }> |
    Readonly<{ sending: true, since: string }>

export type DoneStatus =
    Readonly<{ success: true, at: string }> |
    Readonly<{ success: false, at: string }>

export type CreateSessionState =
    Readonly<{ state: "initial-create-session" }> |
    Readonly<{ state: "try-to-create-session", delayed: boolean, next: Promise<CreateSessionState> }> |
    Readonly<{ state: "failed-to-create-session", err: CreateSessionError }> |
    Readonly<{ state: "succeed-to-create-session", session: Session }>
export const initialCreateSession: CreateSessionState = { state: "initial-create-session" }
export function tryToCreateSession(next: Promise<CreateSessionState>): CreateSessionState {
    return { state: "try-to-create-session", delayed: false, next }
}
export function delayedToCreateSession(next: Promise<CreateSessionState>): CreateSessionState {
    return { state: "try-to-create-session", delayed: true, next }
}
export function failedToCreateSession(err: CreateSessionError): CreateSessionState {
    return { state: "failed-to-create-session", err }
}
export function succeedToCreateSession(session: Session): CreateSessionState {
    return { state: "succeed-to-create-session", session }
}

export type PollingStatusState =
    Readonly<{ state: "initial-polling-status", next: Promise<PollingStatusState> }> |
    Readonly<{ state: "try-to-polling-status", dest: Destination, status: PollingStatus, next: Promise<PollingStatusState> }> |
    Readonly<{ state: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ state: "succeed-to-polling-status", dest: Destination, status: DoneStatus }>
export function initialPollingStatus(next: Promise<PollingStatusState>): PollingStatusState {
    return { state: "initial-polling-status", next }
}
export function tryToPollingStatus(dest: Destination, status: PollingStatus, next: Promise<PollingStatusState>): PollingStatusState {
    return { state: "try-to-polling-status", dest, status, next }
}
export function failedToPollingStatus(err: PollingStatusError): PollingStatusState {
    return { state: "failed-to-polling-status", err }
}
export function succeedToPollingStatus(dest: Destination, status: DoneStatus): PollingStatusState {
    return { state: "succeed-to-polling-status", dest, status }
}

export type ResetState =
    Readonly<{ state: "initial-reset" }> |
    Readonly<{ state: "try-to-reset", delayed: boolean, next: Promise<ResetState> }> |
    Readonly<{ state: "failed-to-reset", err: ResetError }> |
    Readonly<{ state: "succeed-to-reset", nonce: NonceValue, roles: ApiRoles }>
export const initialReset: ResetState = { state: "initial-reset" }
export function tryToReset(next: Promise<ResetState>): ResetState {
    return { state: "try-to-reset", delayed: false, next }
}
export function delayedToReset(next: Promise<ResetState>): ResetState {
    return { state: "try-to-reset", delayed: true, next }
}
export function failedToReset(err: ResetError): ResetState {
    return { state: "failed-to-reset", err }
}
export function succeedToReset(nonce: NonceValue, roles: ApiRoles): ResetState {
    return { state: "succeed-to-reset", nonce, roles }
}

export type CreateSessionError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type PollingStatusError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type ResetError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
