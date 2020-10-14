import { packInputValue, unpackInputValue } from "../../../field/adapter"
import { packLoginID } from "../../../login_id/adapter"

import {
    LoginIDFieldAction,
    LoginIDFieldFactory,
    LoginIDFieldSubscriber,
} from "../action"

import { LoginIDFieldEvent, LoginIDFieldError } from "../data"
import { LoginID } from "../../../login_id/data"
import { InputValue, Content, validContent, invalidContent, hasError } from "../../../field/data"

function validateLoginID(loginID: string): LoginIDFieldError[] {
    if (loginID.length === 0) {
        return ERROR.empty
    }

    return ERROR.ok
}

const ERROR: {
    ok: LoginIDFieldError[]
    empty: LoginIDFieldError[]
} = {
    ok: [],
    empty: ["empty"],
}

class Field implements LoginIDFieldAction {
    post: Post<LoginIDFieldEvent>

    loginID: InputValue

    constructor(post: Post<LoginIDFieldEvent>) {
        this.post = post

        this.loginID = packInputValue("")
    }

    set(input: InputValue): void {
        this.loginID = input
        this.validate()
    }
    validate(): Content<LoginID> {
        const loginID = unpackInputValue(this.loginID)
        const result = hasError(validateLoginID(loginID))
        this.post({ type: "succeed-to-update-login_id", result })

        if (!result.valid) {
            return invalidContent()
        }
        return validContent(packLoginID(loginID))
    }
}

export function initLoginIDFieldFactory(): LoginIDFieldFactory {
    return () => {
        const pubsub = new FieldEventPubSub()
        return {
            action: new Field((event) => pubsub.postLoginIDFieldEvent(event)),
            subscriber: pubsub,
        }
    }
}

class FieldEventPubSub implements LoginIDFieldSubscriber {
    listener: Post<LoginIDFieldEvent>[] = []

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
