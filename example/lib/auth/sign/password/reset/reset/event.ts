import { AuthInfo } from "../../../kernel/auth_info/kernel/data"
import { ResetPasswordError } from "./data"

export type ResetPasswordEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetPasswordError }>
    | Readonly<{ type: "succeed-to-reset"; auth: AuthInfo }>
