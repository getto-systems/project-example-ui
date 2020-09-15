import { LoginIDFieldEvent } from "./data"
import { InputValue } from "../../input/data"

export interface LoginIDFieldAction {
    initLoginIDField(handler: LoginIDFieldEventHandler): LoginIDField
}

export interface LoginIDField {
    set(input: InputValue): Promise<void>
    validate(): Promise<void>
}

export interface LoginIDFieldEventHandler {
    handleLoginIDFieldEvent(event: LoginIDFieldEvent): void
}
