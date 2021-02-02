import { Password } from "../../password/data"
import { Content, Valid } from "../data"
import { PasswordCharacter, PasswordFieldError, PasswordView } from "./data"

export type PasswordFieldEvent = Readonly<{
    type: "succeed-to-update"
    result: Valid<PasswordFieldError>
    content: Content<Password>
    character: PasswordCharacter
    view: PasswordView
}>
