import {
    StartSessionFields,
    ResetFields,
    SessionID, StartSessionError,
    Destination,
    ResetToken,
    PollingStatus,
    PollingStatusError,
} from "./data"

import { AuthCredential } from "../credential/data"

export type StartSessionInfra = Readonly<{
    client: PasswordResetSessionClient
    time: StartSessionTimeConfig
    delayed: Delayed
}>
export type PollingStatusInfra = Readonly<{
    client: PasswordResetSessionClient
    time: PollingStatusTimeConfig
    delayed: Delayed
    wait: Wait
}>

export type StartSessionTimeConfig = Readonly<{
    passwordResetStartSessionDelayTime: DelayTime,
}>

export type PollingStatusTimeConfig = Readonly<{
    passwordResetPollingWaitTime: WaitTime,
    passwordResetPollingLimit: Limit,
}>

export type ResetInfra = Readonly<{
    client: PasswordResetClient,
    time: ResetTimeConfig,
    delayed: Delayed
}>

export type ResetTimeConfig = Readonly<{
    passwordResetDelayTime: DelayTime,
}>

export interface PasswordResetSessionClient {
    startSession(fields: StartSessionFields): Promise<SessionResponse>
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
    reset(token: ResetToken, fields: ResetFields): Promise<ResetResponse>
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

type DelayTime = Readonly<{ delay_milli_second: number }>
type WaitTime = Readonly<{ wait_milli_second: number }>
type Limit = Readonly<{ limit: number }>

interface DelayedHandler {
    (): void
}
interface WaitContent<T> {
    (): T
}
