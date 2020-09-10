import { LoginID } from "../auth_credential/data";
import {
    Session, SessionError,
    Destination,
    PollingStatus, DoneStatus, PollingStatusError,
} from "./data";

export type Infra = {
    passwordResetSessionClient: PasswordResetSessionClient,
}

export interface PasswordResetSessionClient {
    createSession(loginID: LoginID): Promise<SessionResponse>
    sendToken(): Promise<SendTokenResponse>
    getStatus(session: Session): Promise<StatusResponse>
}

export type SessionResponse =
    Readonly<{ success: false, err: SessionError }> |
    Readonly<{ success: true, session: Session }>
export function createSessionFailed(err: SessionError): SessionResponse {
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
