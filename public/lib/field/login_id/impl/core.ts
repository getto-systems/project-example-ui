import { initInputValue, inputValueToString } from "../../../field/adapter"
import { initLoginID } from "../../../login_id/adapter"

import {
    LoginIDFieldAction,
    LoginIDField,
    LoginIDFieldEventPublisher,
    LoginIDFieldEventSubscriber,
} from "../action"

import { LoginIDFieldOperation, LoginIDFieldEvent, LoginIDFieldError } from "../data"
import { LoginID } from "../../../login_id/data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../../field/data"

export function initLoginIDFieldAction(): LoginIDFieldAction {
    return new Action()
}

class Action implements LoginIDFieldAction {
    initLoginIDField(): LoginIDField {
        return new Field()
    }
}

class Field implements LoginIDField {
    pub: LoginIDFieldEventPublisher
    sub: LoginIDFieldEventSubscriber

    loginID: InputValue

    constructor() {
        const pubsub = new FieldEventPubSub()
        this.pub = pubsub
        this.sub = pubsub

        this.loginID = initInputValue("")
    }

    trigger(operation: LoginIDFieldOperation): void {
        this.set(operation.loginID)
    }

    set(input: InputValue): void {
        this.loginID = input
        this.validate()
    }
    validate(): void {
        const [content, result] = this.content()
        this.pub.publishLoginIDFieldEvent({ type: "succeed-to-update-login_id", result, content })
    }

    content(): [Content<LoginID>, Valid<LoginIDFieldError>] {
        const loginID = inputValueToString(this.loginID)
        const result = hasError(validateLoginID(loginID))
        if (!result.valid) {
            return [invalidContent(), result]
        }
        return [validContent(initLoginID(loginID)), result]
    }
}

class FieldEventPubSub implements LoginIDFieldEventPublisher, LoginIDFieldEventSubscriber {
    holder: {
        field: PublisherHolder<LoginIDFieldEvent>
        content: PublisherHolder<Content<LoginID>>
    }

    constructor() {
        this.holder = {
            field: { set: false },
            content: { set: false },
        }
    }

    onLoginIDFieldStateChanged(pub: Publisher<LoginIDFieldEvent>): void {
        this.holder.field = { set: true, pub }
    }
    onLoginIDFieldContentChanged(pub: Publisher<Content<LoginID>>): void {
        this.holder.content = { set: true, pub }
    }

    publishLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        if (this.holder.field.set) {
            this.holder.field.pub(event)
        }
        if (this.holder.content.set) {
            this.holder.content.pub(event.content)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

const ERROR: {
    ok: Array<LoginIDFieldError>,
    empty: Array<LoginIDFieldError>,
} = {
    ok: [],
    empty: ["empty"],
}

function validateLoginID(loginID: string): Array<LoginIDFieldError> {
    if (loginID.length === 0) {
        return ERROR.empty
    }

    return ERROR.ok
}
