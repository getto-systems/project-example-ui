import { AuthCredential } from "../../authCredential/common/data"
import { SubmitPasswordLoginError } from "./data"

export type SubmitPasswordLoginEvent =
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "failed-to-login"; err: SubmitPasswordLoginError }>
    | Readonly<{ type: "succeed-to-login"; authCredential: AuthCredential }>
