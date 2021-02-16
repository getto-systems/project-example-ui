import { AuthnInfo } from "../../authnInfo/common/data"
import { AuthenticatePasswordError } from "./data"

export type AuthenticatePasswordEvent =
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "failed-to-login"; err: AuthenticatePasswordError }>
    | Readonly<{ type: "succeed-to-login"; authnInfo: AuthnInfo }>
