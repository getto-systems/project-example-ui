import { ApplicationComponent } from "../../../sub/getto-example/application/component"
import { FormComponent, FormMaterial } from "../../../sub/getto-form/component/component"
import { LoginIDFormFieldComponent, LoginIDFormFieldMaterial } from "../field/loginID/component"

import { LoginLink } from "../link"

import { StartSession, CheckStatus } from "../../profile/passwordReset/action"

import {
    Destination,
    SendingStatus,
    StartSessionError,
    CheckStatusError,
    SendTokenError,
    StartSessionFields,
} from "../../profile/passwordReset/data"
import { FormConvertResult } from "../../../sub/getto-form/action/data"

export interface PasswordResetSessionComponentFactory {
    (material: PasswordResetSessionMaterial): PasswordResetSessionComponent
}
export type PasswordResetSessionMaterial = Readonly<{
    link: LoginLink
    startSession: StartSession
    checkStatus: CheckStatus
}>

export interface PasswordResetSessionComponent
    extends ApplicationComponent<PasswordResetSessionComponentState> {
    readonly link: LoginLink
    startSession(fields: FormConvertResult<StartSessionFields>): void
}

export type PasswordResetSessionComponentState =
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

export const initialPasswordResetSessionComponentState: PasswordResetSessionComponentState = {
    type: "initial-reset-session",
}

export interface PasswordResetSessionFormComponentFactory {
    (material: PasswordResetSessionFormMaterial): PasswordResetSessionFormComponent
}
export type PasswordResetSessionFormMaterial = FormMaterial &
    LoginIDFormFieldMaterial

export interface PasswordResetSessionFormComponent extends FormComponent {
    readonly loginID: LoginIDFormFieldComponent
    getStartSessionFields(): FormConvertResult<StartSessionFields>
}
