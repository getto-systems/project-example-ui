import {
    Session, CreateSessionError,
    Destination,
    PollingStatus, DoneStatus, PollingStatusError,
    ResetToken,
} from "./data"

import { LoginID, AuthCredential } from "../credential/data"
import { Password } from "../password/data"

export type Infra = Readonly<{
    timeConfig: TimeConfig,
    passwordResetSessionClient: PasswordResetSessionClient,
    passwordResetClient: PasswordResetClient,
}>

export type TimeConfig = Readonly<{
    passwordResetCreateSessionDelayTime: DelayTime,
    passwordResetPollingWaitTime: WaitTime,
    passwordResetPollingLimit: Limit,

    passwordResetDelayTime: DelayTime,
}>

export type DelayTime = Readonly<{ delay_milli_second: number }>
export type WaitTime = Readonly<{ wait_milli_second: number }>
export type Limit = Readonly<{ limit: number }>

export interface PasswordResetSessionClient {
    createSession(loginID: LoginID): Promise<SessionResponse>
    sendToken(): Promise<SendTokenResponse>
    getStatus(session: Session): Promise<StatusResponse>
}

export type SessionResponse =
    Readonly<{ success: false, err: CreateSessionError }> |
    Readonly<{ success: true, session: Session }>
export function createSessionFailed(err: CreateSessionError): SessionResponse {
    return { success: false, err }
}
export function createSessionSuccess(session: Session): SessionResponse {
    return { success: true, session }
}

export type SendTokenResponse =
    Readonly<{ success: false, err: PollingStatusError }> |
    Readonly<{ success: true }>
export function sendTokenFailed(err: PollingStatusError): SendTokenResponse {
    return { success: false, err }
}
export const sendTokenSuccess: SendTokenResponse = { success: true }

export type StatusResponse =
    Readonly<{ success: false, err: PollingStatusError }> |
    Readonly<{ success: true, done: false, dest: Destination, status: PollingStatus }> |
    Readonly<{ success: true, done: true, dest: Destination, status: DoneStatus }>
export function getStatusFailed(err: PollingStatusError): StatusResponse {
    return { success: false, err }
}
export function getStatusPolling(dest: Destination, status: PollingStatus): StatusResponse {
    return { success: true, done: false, dest, status }
}
export function getStatusDone(dest: Destination, status: DoneStatus): StatusResponse {
    return { success: true, done: true, dest, status }
}

export interface PasswordResetClient {
    reset(token: ResetToken, loginID: LoginID, password: Password): Promise<ResetResponse>
}

export type ResetResponse =
    Readonly<{ success: false, err: ResetError }> |
    Readonly<{ success: true, authCredential: AuthCredential }>
export function resetFailed(err: ResetError): ResetResponse {
    return { success: false, err }
}
export function resetSuccess(authCredential: AuthCredential): ResetResponse {
    return { success: true, authCredential }
}

export type ResetError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
