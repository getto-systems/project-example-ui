import { StartComponent } from "./Start/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../common/getto-form/form/action"
import { LoginIDFormFieldAction } from "../../../../common/auth/field/loginID/action"
import { SessionActionPod } from "../../../sign/password/reset/session/action"

export type PasswordResetSessionResource = Readonly<{
    start: StartComponent
    form: FormComponent
}>

export type PasswordResetSessionForegroundActionPod = Readonly<{
    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
    }>
}>
export type PasswordResetSessionBackgroundActionPod = Readonly<{
    initSession: SessionActionPod
}>
