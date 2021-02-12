import { PasswordResetSessionComponent } from "./Session/component"
import { PasswordResetSessionFormComponent } from "./Form/component"

import { FormAction } from "../../../../sub/getto-form/form/action"
import { ApplicationAction } from "../../../common/application/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { ResetSessionAction } from "../../../profile/passwordReset/action"

export type PasswordResetSessionResource = Readonly<{
    session: PasswordResetSessionComponent
    form: PasswordResetSessionFormComponent
}>

export type PasswordResetSessionForegroundAction = Readonly<{
    application: ApplicationAction
    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
    }>
}>
export type PasswordResetSessionBackgroundAction = Readonly<{
    resetSession: ResetSessionAction
}>