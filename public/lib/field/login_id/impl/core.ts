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
        this.pub.dispatchLoginIDFieldEvent({ type: "succeed-to-update-login_id", result, content })
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
    listener: Dispatcher<LoginIDFieldEvent>[]

    constructor() {
        this.listener = []
    }

    onLoginIDFieldEvent(dispatch: Dispatcher<LoginIDFieldEvent>): void {
        this.listener.push(dispatch)
    }

    dispatchLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        this.listener.forEach(dispatch => dispatch(event))
    }
}

interface Dispatcher<T> {
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
