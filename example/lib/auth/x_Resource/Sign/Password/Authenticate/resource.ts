import { AuthenticatePasswordAction } from "../../../../sign/x_Action/Password/Authenticate/Core/action"
import { AuthenticatePasswordFormAction } from "../../../../sign/x_Action/Password/Authenticate/Form/action"

export type AuthenticatePasswordResource = AuthenticatePasswordForegroundResource &
    AuthenticatePasswordBackgroundResource

type AuthenticatePasswordForegroundResource = Readonly<{
    form: AuthenticatePasswordFormAction
}>
export type AuthenticatePasswordBackgroundResource = Readonly<{
    authenticate: AuthenticatePasswordAction
}>
