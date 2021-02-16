import { PasswordResetSessionStartComponent } from "../../../sign/x_Action/Password/Reset/Session/Start/component"
import { PasswordResetSessionFormComponent } from "../../../sign/x_Action/Password/Reset/Session/Form/component"

import { FormAction } from "../../../../common/vendor/getto-form/form/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordResetSessionActionPod } from "../../../sign/password/resetSession/start/action"

export type PasswordResetSessionResource = Readonly<{
    start: PasswordResetSessionStartComponent
    form: PasswordResetSessionFormComponent
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
