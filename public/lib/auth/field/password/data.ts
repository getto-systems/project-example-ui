import { PasswordField } from "../../../field/password/action"

import { PasswordFieldError, PasswordCharacter, PasswordView } from "../../../field/password/data"
import { Password } from "../../../password/data"
import { Valid, Content } from "../../../field/data"

export interface PasswordFieldComponent {
    onContentChange(contentChanged: Publisher<Content<Password>>): void
    init(stateChanged: Publisher<PasswordFieldComponentState>): void
    terminate(): void

    field: PasswordField
}

export type PasswordFieldComponentState = Readonly<{
    type: "succeed-to-update-password",
    result: Valid<PasswordFieldError>,
    character: PasswordCharacter,
    view: PasswordView,
}>

export const initialPasswordFieldComponentState: PasswordFieldComponentState = {
    type: "succeed-to-update-password",
    result: { valid: true },
    character: { complex: false },
    view: { show: false },
}

interface Publisher<T> {
    (state: T): void
}
