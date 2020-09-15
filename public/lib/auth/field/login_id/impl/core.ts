import { LoginIDFieldComponentAction } from "../action"

import { LoginIDField, LoginIDFieldEventHandler } from "../../../../field/login_id/action"

import { LoginIDFieldComponent, LoginIDFieldComponentState } from "../data"

import { LoginID } from "../../../../credential/data"
import { LoginIDFieldEvent } from "../../../../field/login_id/data"
import { Content } from "../../../../input/data"

export function initLoginIDFieldComponent(action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(action)
}

class Component implements LoginIDFieldComponent {
    handler: ComponentEventHandler
    field: LoginIDField

    constructor(action: LoginIDFieldComponentAction) {
        this.handler = new ComponentEventHandler()
        this.field = action.loginIDField.initLoginIDField(this.handler)
    }

    onContentChange(contentChanged: Publisher<Content<LoginID>>): void {
        this.handler.onContentChange(contentChanged)
    }
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
}

class ComponentEventHandler implements LoginIDFieldEventHandler {
    holder: {
        content: PublisherHolder<Content<LoginID>>,
        state: PublisherHolder<LoginIDFieldComponentState>,
    }

    constructor() {
        this.holder = {
            content: { set: false },
            state: { set: false },
        }
    }

    onContentChange(pub: Publisher<Content<LoginID>>): void {
        this.holder.content = { set: true, pub }
    }
    onStateChange(pub: Publisher<LoginIDFieldComponentState>): void {
        this.holder.state = { set: true, pub }
    }

    publishContent(content: Content<LoginID>): void {
        if (this.holder.content.set) {
            this.holder.content.pub(content)
        }
    }
    publishState(state: LoginIDFieldComponentState): void {
        if (this.holder.state.set) {
            this.holder.state.pub(state)
        }
    }

    handleLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        this.publishContent(event.content)
        this.publishState({ type: "input-login-id", result: event.valid })
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
