import { RegisterPasswordAction } from "../../../../../sign/x_Action/Password/ResetSession/Register/Core/action"
import { RegisterPasswordFormAction } from "../../../../../sign/x_Action/Password/ResetSession/Register/Form/action"

export type RegisterPasswordResource = RegisterPasswordForegroundResource &
    RegisterPasswordBackgroundResource

export type RegisterPasswordForegroundResource = Readonly<{
    form: RegisterPasswordFormAction
}>
export type RegisterPasswordBackgroundResource = Readonly<{
    register: RegisterPasswordAction
}>
