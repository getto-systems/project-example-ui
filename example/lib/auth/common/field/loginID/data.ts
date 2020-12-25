import { LoginID } from "../../loginID/data"
import { Content, Valid } from "../data"

export type LoginIDFieldError = "empty"

export type LoginIDFieldEvent = Readonly<{
    type: "succeed-to-update"
    result: Valid<LoginIDFieldError>
    content: Content<LoginID>
}>
