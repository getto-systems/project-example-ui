import { LoginID } from "../../credential/data"
import { InputValue, Valid, Content } from "../../field/data"

export type LoginIDFieldError = "empty"

export type LoginIDFieldOperation =
    Readonly<{ type: "set-login_id", loginID: InputValue }>

export type LoginIDFieldEvent =
    Readonly<{ type: "succeed-to-update-login_id", result: Valid<LoginIDFieldError>, content: Content<LoginID> }>
