import { AuthCredential } from "../../authCredential/common/data"
import { SubmitError } from "./data"

export type SubmitEvent =
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "failed-to-login"; err: SubmitError }>
    | Readonly<{ type: "succeed-to-login"; authCredential: AuthCredential }>
