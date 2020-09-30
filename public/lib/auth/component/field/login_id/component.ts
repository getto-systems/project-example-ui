import { LoginIDFieldError } from "../../../../login_id/field/data"
import { Valid, noError } from "../../../../field/data"

export type LoginIDFieldState =
    Readonly<{ type: "succeed-to-update-login_id", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update-login_id",
    result: noError(),
}
