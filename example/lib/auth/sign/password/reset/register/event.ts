import { AuthCredential } from "../../../authCredential/common/data"
import { SubmitError } from "./data"

export type SubmitEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: SubmitError }>
    | Readonly<{ type: "succeed-to-reset"; authCredential: AuthCredential }>
