import { AuthInfo } from "../../../kernel/authn/kernel/data"
import { ResetError } from "./data"

export type ResetEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetError }>
    | Readonly<{ type: "succeed-to-reset"; auth: AuthInfo }>
