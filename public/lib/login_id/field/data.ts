import { LoginID } from "../data"
import { Content, Valid } from "../../field/data"

export type LoginIDFieldError = "empty"

export type LoginIDFieldEvent =
    Readonly<{ type: "succeed-to-update", result: Valid<LoginIDFieldError>, content: Content<LoginID> }>
