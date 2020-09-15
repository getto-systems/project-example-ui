import { LoginIDFieldEvent } from "./data"
import { InputValue } from "../../input/data"

export interface LoginIDFieldAction {
    initLoginIDField(handler: LoginIDFieldEventHandler): LoginIDField
}

export interface LoginIDField {
    set(input: InputValue): void
    validate(): void
}

export interface LoginIDFieldEventHandler {
    handleLoginIDFieldEvent(event: LoginIDFieldEvent): void
}
