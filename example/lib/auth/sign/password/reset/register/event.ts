import { AuthCredential } from "../../../authCredential/common/data"
import { SubmitPasswordResetRegisterError } from "./data"

export type SubmitPasswordResetRegisterEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: SubmitPasswordResetRegisterError }>
    | Readonly<{ type: "succeed-to-reset"; authCredential: AuthCredential }>
