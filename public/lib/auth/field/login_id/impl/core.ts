import { LoginIDFieldComponentAction } from "../action"

import { LoginIDField, LoginIDFieldEventSubscriber } from "../../../../field/login_id/action"

import { LoginIDFieldComponent, LoginIDFieldComponentState } from "../data"

import { LoginID } from "../../../../credential/data"
import { LoginIDFieldEvent } from "../../../../field/login_id/data"
import { Content } from "../../../../input/data"

export function initLoginIDFieldComponent(action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(...action.loginIDField.initLoginIDField())
}

class Component implements LoginIDFieldComponent {
    field: LoginIDField
    sub: LoginIDFieldEventSubscriber

    constructor(field: LoginIDField, sub: LoginIDFieldEventSubscriber) {
        this.field = field
        this.sub = sub
    }

    onContentChange(contentChanged: Publisher<Content<LoginID>>): void {
        this.sub.onLoginIDFieldContentChanged(contentChanged)
    }
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.sub.onLoginIDFieldStateChanged((event) => {
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
