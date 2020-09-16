import { PasswordFieldComponentAction } from "./action"
import { PasswordField } from "../../../field/password/action"

import { PasswordFieldComponent, PasswordFieldComponentState } from "./data"

import { PasswordFieldEvent } from "../../../field/password/data"
import { Password } from "../../../password/data"
import { Content } from "../../../field/data"

export function initPasswordFieldComponent(action: PasswordFieldComponentAction): PasswordFieldComponent {
    return new Component(action.passwordField.initPasswordField())
}

class Component implements PasswordFieldComponent {
    field: PasswordField

    constructor(field: PasswordField) {
        this.field = field
    }

    onContentChange(contentChanged: Publisher<Content<Password>>): void {
        this.field.sub.onPasswordFieldContentChanged(contentChanged)
    }
    init(stateChanged: Publisher<PasswordFieldComponentState>): void {
        this.field.sub.onPasswordFieldStateChanged((event) => {
            stateChanged(map(event))

            function map(event: PasswordFieldEvent): PasswordFieldComponentState {
                return event
            }
        })
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
