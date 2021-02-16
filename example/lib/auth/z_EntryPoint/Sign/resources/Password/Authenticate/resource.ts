import { AuthenticatePasswordAction } from "../../../../../sign/x_Action/Password/Authenticate/Core/action"
import { AuthenticatePasswordFormAction } from "../../../../../sign/x_Action/Password/Authenticate/Form/action"

export type AuthSignPasswordAuthenticateResource = AuthSignPasswordAuthenticateForegroundResource &
    AuthSignPasswordAuthenticateBackgroundResource

type AuthSignPasswordAuthenticateForegroundResource = Readonly<{
    form: AuthenticatePasswordFormAction
}>
export type AuthSignPasswordAuthenticateBackgroundResource = Readonly<{
    authenticate: AuthenticatePasswordAction
}>
