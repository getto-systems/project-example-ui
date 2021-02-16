import { AuthnInfo } from "../../../authnInfo/common/data"
import { RegisterPasswordResetSessionError } from "./data"

export type RegisterPasswordResetSessionEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: RegisterPasswordResetSessionError }>
    | Readonly<{ type: "succeed-to-reset"; authnInfo: AuthnInfo }>
