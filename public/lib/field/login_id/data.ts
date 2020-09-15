import { LoginID } from "../../credential/data"
import { Valid, Content } from "../../input/data"

export type LoginIDFieldError = "empty"

export type LoginIDFieldEvent =
    Readonly<{ type: "succeed-to-update-login-id", valid: Valid<LoginIDFieldError>, content: Content<LoginID> }>
