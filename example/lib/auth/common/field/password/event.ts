import { Password } from "../../password/data"
import { Content, Valid } from "../data"
import { PasswordCharacter, PasswordValidationError, PasswordView } from "./data"

export type PasswordFieldEvent = Readonly<{
    type: "succeed-to-update"
    result: Valid<PasswordValidationError>
    content: Content<Password>
    character: PasswordCharacter
    view: PasswordView
}>
