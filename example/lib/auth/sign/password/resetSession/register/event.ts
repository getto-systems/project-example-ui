import { AuthnInfo } from "../../../kernel/authnInfo/kernel/data"
import { RegisterPasswordError } from "./data"

export type RegisterPasswordEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: RegisterPasswordError }>
    | Readonly<{ type: "succeed-to-reset"; authnInfo: AuthnInfo }>
