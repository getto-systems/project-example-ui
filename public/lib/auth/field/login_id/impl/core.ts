import { LoginIDFieldComponentAction } from "../action"

import { LoginIDField } from "../../../../field/login_id/action"

import { LoginIDFieldComponent, LoginIDFieldComponentState } from "../data"

import { LoginID } from "../../../../credential/data"
import { LoginIDFieldEvent } from "../../../../field/login_id/data"
import { Content } from "../../../../field/data"

export function initLoginIDFieldComponent(action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(action.loginIDField.initLoginIDField())
}

class Component implements LoginIDFieldComponent {
    field: LoginIDField

    constructor(field: LoginIDField) {
        this.field = field
    }

    onContentChange(contentChanged: Publisher<Content<LoginID>>): void {
        this.field.sub.onLoginIDFieldContentChanged(contentChanged)
    }
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.field.sub.onLoginIDFieldStateChanged((event) => {
            stateChanged(map(event))

            function map(event: LoginIDFieldEvent): LoginIDFieldComponentState {
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
