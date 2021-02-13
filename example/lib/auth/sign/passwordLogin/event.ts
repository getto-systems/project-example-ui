import { AuthCredential } from "../authCredential/common/data"
import { LoginError } from "./data"

export type LoginEvent =
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "failed-to-login"; err: LoginError }>
    | Readonly<{ type: "succeed-to-login"; authCredential: AuthCredential }>
