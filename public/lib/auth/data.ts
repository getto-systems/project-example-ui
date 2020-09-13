import { RenewError } from "../credential/data"
import { CheckError } from "../script/data"

export type AuthComponentError =
    Readonly<{ type: "renew", err: RenewError }> |
    Readonly<{ type: "load", err: CheckError }>
