import { FormField, FormInput } from "../../../../sub/getto-form/action/action"

import { PasswordFieldEvent } from "./event"

import { Password } from "../../password/data"
import { InputValue } from "../data"
import { PasswordCharacter, PasswordValidationError, PasswordViewState } from "./data"
import { FormInputString } from "../../../../sub/getto-form/data"

export type PasswordFormFieldAction = Readonly<{
    field: PasswordFormFieldPod
    character: PasswordCharacterCheckerPod
    viewer: PasswordViewerPod
}>

export interface PasswordFormFieldPod {
    (): PasswordFormField
}
export type PasswordFormField = FormField<Password, PasswordValidationError, FormInput>

export interface PasswordCharacterCheckerPod {
    (): PasswordCharacterChecker
}
export interface PasswordCharacterChecker {
    (password: FormInputString): PasswordCharacter
}

export interface PasswordViewerPod {
    (): PasswordViewer
}
export interface PasswordViewer {
    get(): PasswordViewState
    show(post: Post<PasswordViewState>): void
    hide(post: Post<PasswordViewState>): void
}

// TODO 以下、削除
export type PasswordFieldAction = Readonly<{
    password: PasswordFieldPod
}>

export interface PasswordFieldPod {
    (): PasswordField
}
export interface PasswordField {
    set(input: InputValue, post: Post<PasswordFieldEvent>): void
    show(post: Post<PasswordFieldEvent>): void
    hide(post: Post<PasswordFieldEvent>): void
    validate(post: Post<PasswordFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
