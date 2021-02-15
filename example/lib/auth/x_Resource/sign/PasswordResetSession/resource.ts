import { StartComponent } from "./Start/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../vendor/getto-form/form/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordResetSessionActionPod } from "../../../sign/password/reset/session/action"

export type PasswordResetSessionResource = Readonly<{
    start: StartComponent
    form: FormComponent
}>

export type PasswordResetSessionForegroundAction = Readonly<{
    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
    }>
}>
export type PasswordResetSessionBackgroundActionPod = Readonly<{
    initSession: PasswordResetSessionActionPod
}>
