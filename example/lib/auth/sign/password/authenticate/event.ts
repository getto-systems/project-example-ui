import { AuthInfo } from "../../kernel/authInfo/kernel/data"
import { AuthenticateError } from "./data"

export type AuthenticateEvent =
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "failed-to-login"; err: AuthenticateError }>
    | Readonly<{ type: "succeed-to-login"; auth: AuthInfo }>
