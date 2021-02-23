import { AuthnInfo } from "../../../kernel/authnInfo/kernel/data"
import { ResetError } from "./data"

export type ResetEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetError }>
    | Readonly<{ type: "succeed-to-reset"; authnInfo: AuthnInfo }>
