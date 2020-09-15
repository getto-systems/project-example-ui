import { LoginIDFieldComponentAction, LoginIDFieldComponent, LoginIDFieldComponentEventHandler } from "../action"

import { LoginIDField } from "../../../../field/login_id/action"

import { LoginIDFieldComponentState } from "../data"

import { LoginID } from "../../../../credential/data"
import { LoginIDFieldEvent } from "../../../../field/login_id/data"
import { Content } from "../../../../input/data"

export function initLoginIDFieldComponent(handler: LoginIDFieldComponentEventHandler, action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(handler, action.loginIDField.initLoginIDField())
}
export function initLoginIDFieldComponentEventHandler(): LoginIDFieldComponentEventHandler {
    return new ComponentEventHandler()
}

class Component implements LoginIDFieldComponent {
    handler: LoginIDFieldComponentEventHandler
    field: LoginIDField

    constructor(
        handler: LoginIDFieldComponentEventHandler,
        field: LoginIDField,
    ) {
        this.handler = handler
        this.field = field
    }

    onContentChange(contentChanged: Publisher<Content<LoginID>>): void {
        this.handler.onContentChange(contentChanged)
    }
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
}

class ComponentEventHandler implements LoginIDFieldComponentEventHandler {
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

    publish(content: Content<LoginID>, state: LoginIDFieldComponentState): void {
        if (this.holder.content.set) {
            this.holder.content.pub(content)
        }
        if (this.holder.state.set) {
            this.holder.state.pub(state)
        }
    }

    handleLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        this.publish(event.content, { type: "input-login-id", result: event.valid })
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
