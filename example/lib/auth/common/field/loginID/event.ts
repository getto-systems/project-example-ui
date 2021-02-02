import { LoginID } from "../../loginID/data"
import { Content, Valid } from "../data"
import { LoginIDFieldError } from "./data"

export type LoginIDFieldEvent = Readonly<{
    type: "succeed-to-update"
    result: Valid<LoginIDFieldError>
    content: Content<LoginID>
}>
