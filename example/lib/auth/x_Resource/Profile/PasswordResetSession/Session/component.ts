import { ApplicationComponent } from "../../../../../sub/getto-example/Application/component"

import { StartSession, CheckStatus } from "../../../../profile/passwordReset/action"

import {
    Destination,
    SendingStatus,
    StartSessionError,
    CheckStatusError,
    SendTokenError,
    StartSessionFields,
} from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"

export interface SessionComponentFactory {
    (material: SessionMaterial): SessionComponent
}
export type SessionMaterial = Readonly<{
    startSession: StartSession
    checkStatus: CheckStatus
}>

export interface SessionComponent extends ApplicationComponent<SessionComponentState> {
    startSession(fields: FormConvertResult<StartSessionFields>): void
}

export type SessionComponentState =
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

export const initialSessionComponentState: SessionComponentState = {
    type: "initial-reset-session",
}
