import { Valid } from "../../field/data"

export type LoginIDFieldError = "empty"

export type LoginIDFieldEvent =
    Readonly<{ type: "succeed-to-update-login_id", result: Valid<LoginIDFieldError> }>
