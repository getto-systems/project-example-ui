import { LoginIDField } from "../../../common/field/loginID/action"

import { LoginIDFieldEvent } from "../../../common/field/loginID/event"

import { LoginIDFieldError } from "../../../common/field/loginID/data"
import { ApplicationComponent } from "../../../../sub/getto-example/application/component"

import { InputValue, Valid, noError } from "../../../common/field/data"

export interface LoginIDFieldComponentFactory {
    (material: LoginIDFieldMaterial): LoginIDFieldComponent
}
export type LoginIDFieldMaterial = Readonly<{
    loginID: LoginIDField
}>

export interface LoginIDFieldComponent extends ApplicationComponent<LoginIDFieldState> {
    set(inputValue: InputValue): void
    validate(handler: Handler<LoginIDFieldEvent>): void
}

// TODO variant が 1つなら type いらない
export type LoginIDFieldState = Readonly<{ type: "succeed-to-update"; result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update",
    result: noError(),
}

interface Handler<T> {
    (state: T): void
}
