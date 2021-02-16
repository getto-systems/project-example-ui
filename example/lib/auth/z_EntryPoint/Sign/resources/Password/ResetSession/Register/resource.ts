import { RegisterPasswordResetSessionAction } from "../../../../../../sign/x_Action/Password/Reset/Register/Core/action"
import { RegisterPasswordResetSessionFormAction } from "../../../../../../sign/x_Action/Password/Reset/Register/Form/action"

export type AuthSignPasswordResetSessionRegisterResource = AuthSignPasswordResetSessionRegisterForegroundResource &
    AuthSignPasswordResetSessionRegisterBackgroundResource

export type AuthSignPasswordResetSessionRegisterForegroundResource = Readonly<{
    form: RegisterPasswordResetSessionFormAction
}>
export type AuthSignPasswordResetSessionRegisterBackgroundResource = Readonly<{
    register: RegisterPasswordResetSessionAction
}>
