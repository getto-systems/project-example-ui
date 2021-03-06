import { RemoteCommonError } from "../../../../z_vendor/getto-application/infra/remote/data"

import { LoginID } from "../../../login_id/data"

export type RequestResetTokenFields = Readonly<{
    loginID: LoginID
}>

export type RequestResetTokenError =
    | Readonly<{ type: "validation-error" }>
    | RequestResetTokenRemoteError

export type RequestResetTokenRemoteError =
    | RemoteCommonError
    | Readonly<{ type: "invalid-reset" }>
