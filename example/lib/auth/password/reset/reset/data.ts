import { RemoteCommonError } from "../../../../z_vendor/getto-application/infra/remote/data"
import { LoginID } from "../../../login_id/data"
import { Password } from "../../data"

export type ResetPasswordFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type ResetPasswordError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "empty-reset-token" }>
    | ResetPasswordRemoteError

export type ResetPasswordRemoteError =
    | RemoteCommonError
    | Readonly<{ type: "invalid-reset" }>
    | Readonly<{ type: "already-reset" }>
