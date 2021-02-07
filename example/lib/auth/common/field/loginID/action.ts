import { FormField } from "../../../../sub/getto-form/action/action"

import { LoginIDFieldEvent } from "./event"

import { InputValue } from "../data"
import { LoginID } from "../../loginID/data"
import { LoginIDValidationError, LoginIDInput } from "./data"

export type LoginIDFormFieldAction = Readonly<{
    field: LoginIDFormFieldPod
}>

export interface LoginIDFormFieldPod {
    (): LoginIDFormField
}
export type LoginIDFormField = FormField<LoginID, LoginIDValidationError, LoginIDInput>

// TODO 以下、削除
export type LoginIDFieldAction = Readonly<{
    loginID: LoginIDFieldPod
}>

export interface LoginIDFieldPod {
    (): LoginIDField
}
export interface LoginIDField {
    set(input: InputValue, post: Post<LoginIDFieldEvent>): void
    validate(post: Post<LoginIDFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
