import {
    SessionID, StartSessionError,
    Destination,
    ResetToken,
    PollingStatus,
    PollingStatusError,
} from "./data"

import { AuthCredential } from "../credential/data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"

export type Infra = Readonly<{
    timeConfig: TimeConfig,
    passwordResetSessionClient: PasswordResetSessionClient,
    passwordResetClient: PasswordResetClient,
    delayed: Delayed
    wait: Wait
}>

export type TimeConfig = Readonly<{
    passwordResetStartSessionDelayTime: DelayTime,
    passwordResetPollingWaitTime: WaitTime,
    passwordResetPollingLimit: Limit,

    passwordResetDelayTime: DelayTime,
}>

export type DelayTime = Readonly<{ delay_milli_second: number }>
export type WaitTime = Readonly<{ wait_milli_second: number }>
export type Limit = Readonly<{ limit: number }>

export interface PasswordResetSessionClient {
    startSession(loginID: LoginID): Promise<SessionResponse>
    sendToken(): Promise<SendTokenResponse>
    getStatus(sessionID: SessionID): Promise<GetStatusResponse>
}

export type SessionResponse =
    Readonly<{ success: false, err: StartSessionError }> |
    Readonly<{ success: true, sessionID: SessionID }>
export function startSessionFailed(err: StartSessionError): SessionResponse {
    return { success: false, err }
}
export function startSessionSuccess(sessionID: SessionID): SessionResponse {
    return { success: true, sessionID }
}

export type SendTokenResponse =
    Readonly<{ success: false, err: PollingStatusError }> |
    Readonly<{ success: true }>
export function sendTokenFailed(err: PollingStatusError): SendTokenResponse {
    return { success: false, err }
}
export const sendTokenSuccess: SendTokenResponse = { success: true }

export type GetStatusResponse =
    Readonly<{ success: false, err: PollingStatusError }> |
    Readonly<{ success: true, done: false, dest: Destination, status: PollingStatus }> |
    Readonly<{ success: true, done: true, send: false, dest: Destination, err: string }> |
    Readonly<{ success: true, done: true, send: true, dest: Destination }>
export function getStatusFailed(err: PollingStatusError): GetStatusResponse {
    return { success: false, err }
}
export function getStatusPolling(dest: Destination, status: PollingStatus): GetStatusResponse {
    return { success: true, done: false, dest, status }
}
export function getStatusSendFailed(dest: Destination, err: string): GetStatusResponse {
    return { success: true, done: true, send: false, dest, err }
}
export function getStatusSend(dest: Destination): GetStatusResponse {
    return { success: true, done: true, send: true, dest }
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

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, delayTimeExceeded: DelayedHandler): Promise<T>
}
export interface Wait {
    <T>(time: WaitTime, content: WaitContent<T>): Promise<T>
}

interface DelayedHandler {
    (): void
}
interface WaitContent<T> {
    (): T
}
