import { LoginID } from "../../loginID/data"
import { Content, Valid } from "../data"
import { LoginIDValidationError } from "./data"

export type LoginIDFieldEvent = Readonly<{
    type: "succeed-to-update"
    result: Valid<LoginIDValidationError>
    content: Content<LoginID>
}>
