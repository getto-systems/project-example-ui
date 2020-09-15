import {
    PasswordFieldComponent,
    PasswordFieldComponentAction,
} from "../action"
import { PasswordField, PasswordFieldEventHandler } from "../../../../field/password/action"

import { PasswordFieldComponentState } from "../data"

import { PasswordFieldEvent } from "../../../../field/password/data"
import { Password } from "../../../../password/data"
import { Content } from "../../../../input/data"

export function initPasswordFieldComponent(action: PasswordFieldComponentAction): PasswordFieldComponent {
    return new Component(action)
}

class Component implements PasswordFieldComponent {
    handler: ComponentEventHandler
    field: PasswordField

    constructor(action: PasswordFieldComponentAction) {
        this.handler = new ComponentEventHandler()
        this.field = action.passwordField.initPasswordField(this.handler)
    }

    onContentChange(contentChanged: Publisher<Content<Password>>): void {
        this.handler.onContentChange(contentChanged)
    }
    init(stateChanged: Publisher<PasswordFieldComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
}

class ComponentEventHandler implements PasswordFieldEventHandler {
    holder: {
        content: PublisherHolder<Content<Password>>,
        state: PublisherHolder<PasswordFieldComponentState>,
    }

    constructor() {
        this.holder = {
            content: { set: false },
            state: { set: false },
        }
    }

    onContentChange(pub: Publisher<Content<Password>>): void {
        this.holder.content = { set: true, pub }
    }
    onStateChange(pub: Publisher<PasswordFieldComponentState>): void {
        this.holder.state = { set: true, pub }
    }

    publishContent(content: Content<Password>): void {
        if (this.holder.content.set) {
            this.holder.content.pub(content)
        }
    }
    publishState(state: PasswordFieldComponentState): void {
        if (this.holder.state.set) {
            this.holder.state.pub(state)
        }
    }

    handlePasswordFieldEvent(event: PasswordFieldEvent): void {
        this.publishContent(event.content)
        this.publishState({ type: "input-password", result: event.result, character: event.character, view: event.view })
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
