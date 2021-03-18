import { RemoteCommonError } from "../../../z_vendor/getto-application/infra/remote/data"
import { LoginID } from "../../login_id/data"
import { Password } from "../data"

export type AuthenticatePasswordFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type AuthenticatePasswordError =
    | Readonly<{ type: "validation-error" }>
    | AuthenticatePasswordRemoteError

export type AuthenticatePasswordRemoteError =
    | RemoteCommonError
    | Readonly<{ type: "invalid-password-login" }>
