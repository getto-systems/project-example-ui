import { PasswordFieldComponentAction } from "../action"
import { PasswordField, PasswordFieldEventSubscriber } from "../../../../field/password/action"

import { PasswordFieldComponent, PasswordFieldComponentState } from "../data"

import { PasswordFieldEvent } from "../../../../field/password/data"
import { Password } from "../../../../password/data"
import { Content } from "../../../../input/data"

export function initPasswordFieldComponent(action: PasswordFieldComponentAction): PasswordFieldComponent {
    return new Component(...action.passwordField.initPasswordField())
}

class Component implements PasswordFieldComponent {
    field: PasswordField
    sub: PasswordFieldEventSubscriber

    constructor(field: PasswordField, sub: PasswordFieldEventSubscriber) {
        this.field = field
        this.sub = sub
    }

    onContentChange(contentChanged: Publisher<Content<Password>>): void {
        this.sub.onPasswordFieldContentChanged(contentChanged)
    }
    init(stateChanged: Publisher<PasswordFieldComponentState>): void {
        this.sub.onPasswordFieldStateChanged((event) => {
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
