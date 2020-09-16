import { LoginID } from "../../credential/data"
import { Valid, Content } from "../../field/data"

export type LoginIDFieldError = "empty"

export type LoginIDFieldEvent =
    Readonly<{ type: "succeed-to-update-login-id", result: Valid<LoginIDFieldError>, content: Content<LoginID> }>
