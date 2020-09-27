import { packInputValue, unpackInputValue } from "../../../field/adapter"
import { packLoginID } from "../../../login_id/adapter"

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

        this.loginID = packInputValue("")
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
        this.pub.postLoginIDFieldEvent({ type: "succeed-to-update-login_id", result, content })
    }

    content(): [Content<LoginID>, Valid<LoginIDFieldError>] {
        const loginID = unpackInputValue(this.loginID)
        const result = hasError(validateLoginID(loginID))
        if (!result.valid) {
            return [invalidContent(), result]
        }
        return [validContent(packLoginID(loginID)), result]
    }
}

class FieldEventPubSub implements LoginIDFieldEventPublisher, LoginIDFieldEventSubscriber {
    listener: Post<LoginIDFieldEvent>[]

    constructor() {
        this.listener = []
    }

    onLoginIDFieldEvent(post: Post<LoginIDFieldEvent>): void {
        this.listener.push(post)
    }

    postLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        this.listener.forEach(post => post(event))
    }
}

interface Post<T> {
    (state: T): void
}

const ERROR: {
    ok: LoginIDFieldError[],
    empty: LoginIDFieldError[],
} = {
    ok: [],
    empty: ["empty"],
}

function validateLoginID(loginID: string): LoginIDFieldError[] {
    if (loginID.length === 0) {
        return ERROR.empty
    }

    return ERROR.ok
}
