import { AuthCredential } from "../../common/credential/data"
import {
    StartSessionFields,
    ResetFields,
    SessionID,
    StartSessionError,
    Destination,
    ResetToken,
    SendingStatus,
    CheckStatusError,
} from "./data"

export type StartSessionInfra = Readonly<{
    client: PasswordResetSessionClient
    time: StartSessionTimeConfig
    delayed: Delayed
}>
export type CheckStatusInfra = Readonly<{
    client: PasswordResetSessionClient
    time: CheckStatusTimeConfig
    delayed: Delayed
    wait: Wait
}>

export type StartSessionTimeConfig = Readonly<{
    delay: DelayTime
}>

export type CheckStatusTimeConfig = Readonly<{
    wait: WaitTime
    limit: Limit
}>

export type ResetInfra = Readonly<{
    client: PasswordResetClient
    time: ResetTimeConfig
    delayed: Delayed
}>

export type ResetTimeConfig = Readonly<{
    delay: DelayTime
}>

export interface PasswordResetSessionClient {
    startSession(fields: StartSessionFields): Promise<SessionResponse>
    sendToken(): Promise<SendTokenResponse>
    getStatus(sessionID: SessionID): Promise<GetStatusResponse>
}

export type SessionResponse =
    | Readonly<{ success: false; err: StartSessionError }>
    | Readonly<{ success: true; sessionID: SessionID }>
export function startSessionFailed(err: StartSessionError): SessionResponse {
    return { success: false, err }
}
export function startSessionSuccess(sessionID: SessionID): SessionResponse {
    return { success: true, sessionID }
}

export type SendTokenResponse =
    | Readonly<{ success: false; err: CheckStatusError }>
    | Readonly<{ success: true }>
export function sendTokenFailed(err: CheckStatusError): SendTokenResponse {
    return { success: false, err }
}
export const sendTokenSuccess: SendTokenResponse = { success: true }

export type GetStatusResponse =
    | Readonly<{ success: false; err: CheckStatusError }>
    | Readonly<{ success: true; dest: Destination; done: false; status: SendingStatus }>
    | Readonly<{ success: true; dest: Destination; done: true; send: false; err: string }>
    | Readonly<{ success: true; dest: Destination; done: true; send: true }>
export function getStatusFailed(err: CheckStatusError): GetStatusResponse {
    return { success: false, err }
}
export function getStatusInProgress(dest: Destination, status: SendingStatus): GetStatusResponse {
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
    | Readonly<{ success: false; err: ResetError }>
    | Readonly<{ success: true; authCredential: AuthCredential }>
export function resetFailed(err: ResetError): ResetResponse {
    return { success: false, err }
}
export function resetSuccess(authCredential: AuthCredential): ResetResponse {
    return { success: true, authCredential }
}

export type ResetError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, delayTimeExceeded: DelayedHandler): Promise<T>
}
export interface Wait {
    <T>(time: WaitTime, content: WaitContent<T>): Promise<T>
}

type DelayTime = Readonly<{ delay_millisecond: number }>
type WaitTime = Readonly<{ wait_millisecond: number }>
type Limit = Readonly<{ limit: number }>

interface DelayedHandler {
    (): void
}
interface WaitContent<T> {
    (): T
}
