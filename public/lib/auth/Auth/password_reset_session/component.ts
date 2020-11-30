import { AuthLink } from "../link"

import { StartSessionAction, CheckStatusAction } from "../../password_reset/action"

import {
    Destination,
    SendingStatus,
    StartSessionError,
    CheckStatusError,
    SendTokenError,
} from "../../password_reset/data"

export interface PasswordResetSessionComponentFactory {
    (actions: PasswordResetSessionActionSet): PasswordResetSessionComponent
}
export type PasswordResetSessionActionSet = Readonly<{
    link: AuthLink
    startSession: StartSessionAction
    checkStatus: CheckStatusAction
}>

export interface PasswordResetSessionComponent {
    readonly link: AuthLink
    onStateChange(post: Post<PasswordResetSessionState>): void
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

interface Post<T> {
    (state: T): void
}
