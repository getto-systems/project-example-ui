import { LoginID, LoginIDBoard, AuthCredential } from "../auth_credential/data";
import { Password, PasswordBoard } from "../password/data";
import { InputValue } from "../input/data";

export type InputContent = Readonly<{
    loginID: InputValue,
    password: InputValue,
}>

export type Session = Readonly<{ sessionID: Readonly<string> }>
export type ResetToken = Readonly<{ resetToken: Readonly<string> }>

export type ResetTokenBoard =
    Readonly<{ err: Array<ResetTokenValidationError> }>

export type ResetTokenValidationError = "empty";

export type ValidResetToken =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, content: ResetToken }>

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

export type CreateSessionBoard = Readonly<[LoginIDBoard]>
export type CreateSessionContent = Readonly<[LoginID]>

export type CreateSessionState =
    Readonly<{ state: "initial-create-session" }> |
    Readonly<{ state: "try-to-create-session", delayed: boolean, promise: Promise<CreateSessionState> }> |
    Readonly<{ state: "failed-to-create-session", err: CreateSessionError }> |
    Readonly<{ state: "succeed-to-create-session", session: Session }>
export const initialCreateSession: CreateSessionState = { state: "initial-create-session" }
export function tryToCreateSession(promise: Promise<CreateSessionState>): CreateSessionState {
    return { state: "try-to-create-session", delayed: false, promise }
}
export function delayedToCreateSession(promise: Promise<CreateSessionState>): CreateSessionState {
    return { state: "try-to-create-session", delayed: true, promise }
}
export function failedToCreateSession(err: CreateSessionError): CreateSessionState {
    return { state: "failed-to-create-session", err }
}
export function succeedToCreateSession(session: Session): CreateSessionState {
    return { state: "succeed-to-create-session", session }
}

export type PollingStatusState =
    Readonly<{ state: "initial-polling-status" }> |
    Readonly<{ state: "try-to-polling-status", promise: Promise<PollingStatusState> }> |
    Readonly<{ state: "retry-to-polling-status", dest: Destination, status: PollingStatus, promise: Promise<PollingStatusState> }> |
    Readonly<{ state: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ state: "succeed-to-polling-status", dest: Destination, status: DoneStatus }>
export const initialPollingStatus: PollingStatusState = { state: "initial-polling-status" }
export function tryToPollingStatus(promise: Promise<PollingStatusState>): PollingStatusState {
    return { state: "try-to-polling-status", promise }
}
export function retryToPollingStatus(dest: Destination, status: PollingStatus, promise: Promise<PollingStatusState>): PollingStatusState {
    return { state: "retry-to-polling-status", dest, status, promise }
}
export function failedToPollingStatus(err: PollingStatusError): PollingStatusState {
    return { state: "failed-to-polling-status", err }
}
export function succeedToPollingStatus(dest: Destination, status: DoneStatus): PollingStatusState {
    return { state: "succeed-to-polling-status", dest, status }
}

export type ResetBoard = Readonly<[ResetTokenBoard, LoginIDBoard, PasswordBoard]>
export type ResetContent = Readonly<[ResetToken, LoginID, Password]>

export type ResetState =
    Readonly<{ state: "initial-reset" }> |
    Readonly<{ state: "try-to-reset", delayed: boolean, promise: Promise<ResetState> }> |
    Readonly<{ state: "failed-to-reset", err: ResetError }> |
    Readonly<{ state: "succeed-to-reset", authCredential: AuthCredential }>
export const initialReset: ResetState = { state: "initial-reset" }
export function tryToReset(promise: Promise<ResetState>): ResetState {
    return { state: "try-to-reset", delayed: false, promise }
}
export function delayedToReset(promise: Promise<ResetState>): ResetState {
    return { state: "try-to-reset", delayed: true, promise }
}
export function failedToReset(err: ResetError): ResetState {
    return { state: "failed-to-reset", err }
}
export function succeedToReset(authCredential: AuthCredential): ResetState {
    return { state: "succeed-to-reset", authCredential }
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
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type ValidContent<T> =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, content: T }>
export function invalidContent<T>(): ValidContent<T> {
    return { valid: false }
}
export function validContent<T>(content: T): ValidContent<T> {
    return { valid: true, content }
}
