import { AuthenticatePasswordAction } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export type AuthenticatePasswordResource = AuthenticatePasswordForegroundResource &
    AuthenticatePasswordBackgroundResource

type AuthenticatePasswordForegroundResource = Readonly<{
    form: AuthenticatePasswordFormAction
}>
export type AuthenticatePasswordBackgroundResource = Readonly<{
    authenticate: AuthenticatePasswordAction
}>
