import { LoginID, TicketNonce, ApiRoles } from "../credential/data";
import { Password } from "../password/data";
import {
    Session,
    ResetToken,
    Destination,
    PollingStatus,
    DoneStatus,
} from "./data";

export type Infra = {
    passwordResetClient: PasswordResetClient,
}

export interface PasswordResetClient {
    createSession(loginID: LoginID): Promise<CreateSessionResponse>
    sendToken(): Promise<SendTokenResponse>
    getStatus(session: Session): Promise<GetStatusResponse>
    reset(token: ResetToken, loginID: LoginID, password: Password): Promise<ResetResponse>
}

export type CreateSessionResponse =
    Readonly<{ success: false, err: CreateSessionError }> |
    Readonly<{ success: true, session: Session }>
export function createSessionFailed(err: CreateSessionError): CreateSessionResponse {
    return { success: false, err }
}
export function createSessionSuccess(session: Session): CreateSessionResponse {
    return { success: true, session }
}

export type CreateSessionError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type SendTokenResponse =
    Readonly<{ success: false, err: SendTokenError }> |
    Readonly<{ success: true }>
export function sendTokenFailed(err: SendTokenError): SendTokenResponse {
    return { success: false, err }
}
export const sendTokenSuccess: SendTokenResponse = { success: true }

export type SendTokenError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type GetStatusResponse =
    Readonly<{ state: "failed", err: GetStatusError }> |
    Readonly<{ state: "polling", dest: Destination, status: PollingStatus }> |
    Readonly<{ state: "done", dest: Destination, status: DoneStatus }>
export function getStatusFailed(err: GetStatusError): GetStatusResponse {
    return { state: "failed", err }
}
export function getStatusPolling(dest: Destination, status: PollingStatus): GetStatusResponse {
    return { state: "polling", dest, status }
}
export function getStatusDone(dest: Destination, status: DoneStatus): GetStatusResponse {
    return { state: "done", dest, status }
}

export type GetStatusError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type ResetResponse =
    Readonly<{ success: false, err: ResetError }> |
    Readonly<{ success: true, nonce: TicketNonce, roles: ApiRoles }>
export function resetFailed(err: ResetError): ResetResponse {
    return { success: false, err }
}
export function resetSuccess(nonce: TicketNonce, roles: ApiRoles): ResetResponse {
    return { success: true, nonce, roles }
}

export type ResetError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
