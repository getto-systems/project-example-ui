import { ApplicationComponent } from "../../../sub/getto-example/application/component"

import { LoginLink } from "../link"

import { StartSession, CheckStatus } from "../../profile/passwordReset/action"

import {
    Destination,
    SendingStatus,
    StartSessionError,
    CheckStatusError,
    SendTokenError,
} from "../../profile/passwordReset/data"

export interface PasswordResetSessionComponentFactory {
    (material: PasswordResetSessionMaterial): PasswordResetSessionComponent
}
export type PasswordResetSessionMaterial = Readonly<{
    link: LoginLink
    startSession: StartSession
    checkStatus: CheckStatus
}>

export interface PasswordResetSessionComponent extends ApplicationComponent<PasswordResetSessionState> {
    readonly link: LoginLink
    startSession(): void
}

export type PasswordResetSessionState =
    | Readonly<{ type: "initial-reset-session" }>
    | Readonly<{ type: "try-to-start-session" }>
    | Readonly<{ type: "delayed-to-start-session" }>
    | Readonly<{ type: "failed-to-start-session"; err: StartSessionError }>
    | Readonly<{ type: "try-to-check-status" }>
    | Readonly<{ type: "retry-to-check-status"; dest: Destination; status: SendingStatus }>
    | Readonly<{ type: "failed-to-check-status"; err: CheckStatusError }>
    | Readonly<{ type: "failed-to-send-token"; dest: Destination; err: SendTokenError }>
    | Readonly<{ type: "succeed-to-send-token"; dest: Destination }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordResetSessionState: PasswordResetSessionState = {
    type: "initial-reset-session",
}
