import { StartComponent } from "./Start/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../common/getto-form/form/action"
import { ApplicationAction } from "../../../sign/location/action"
import { LoginIDFormFieldAction } from "../../../../common/auth/field/loginID/action"
import { ResetSessionAction } from "../../../sign/passwordReset/action"

export type PasswordResetSessionResource = Readonly<{
    start: StartComponent
    form: FormComponent
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
