import { packInputValue, unpackInputValue } from "../../../field/adapter"
import { packPassword } from "../../../password/adapter"

import {
    PasswordFieldAction,
    PasswordFieldFactory,
    PasswordFieldSubscriber,
} from "../action"

import {
    PasswordFieldEvent,
    PasswordFieldError,
    PasswordCharacter, simplePassword, complexPassword,
    PasswordView, showPassword, hidePassword,
} from "../data"
import { Password } from "../../../password/data"
import { InputValue, Content, validContent, invalidContent, hasError } from "../../../field/data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

function validatePassword(password: string): PasswordFieldError[] {
    if (password.length === 0) {
        return ERROR.empty
    }

    if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
        return ERROR.tooLong
    }

    return ERROR.ok
}

const ERROR: {
    ok: PasswordFieldError[]
    empty: PasswordFieldError[]
    tooLong: PasswordFieldError[]
} = {
    ok: [],
    empty: ["empty"],
    tooLong: ["too-long"],
}

function checkCharacter(password: string): PasswordCharacter {
    for (let i = 0; i < password.length; i++) {
        // 1文字でも 128バイト以上の文字があれば complex
        if (password.charCodeAt(i) >= 128) {
            return complexPassword
        }
    }
    return simplePassword
}

class Field implements PasswordFieldAction {
    post: Post<PasswordFieldEvent>

    password: InputValue
    visible: boolean

    constructor(post: Post<PasswordFieldEvent>) {
        this.post = post

        this.password = packInputValue("")
        this.visible = false
    }

    view(): PasswordView {
        if (this.visible) {
            return showPassword(this.password)
        } else {
            return hidePassword
        }
    }

    set(input: InputValue): void {
        this.password = input
        this.validate()
    }
    show(): void {
        this.visible = true
        this.validate()
    }
    hide(): void {
        this.visible = false
        this.validate()
    }
    validate(): Content<Password> {
        const password = unpackInputValue(this.password)
        const result = hasError(validatePassword(password))
        const character = checkCharacter(password)
        const view = this.view()

        this.post({ type: "succeed-to-update-password", result, character, view })

        if (!result.valid) {
            return invalidContent()
        }
        return validContent(packPassword(password))
    }
}

export function initPasswordFieldFactory(): PasswordFieldFactory {
    return () => {
        const pubsub = new FieldEventPubSub()
        return {
            action: new Field((event) => pubsub.postPasswordFieldEvent(event)),
            subscriber: pubsub,
        }
    }
}

class FieldEventPubSub implements PasswordFieldSubscriber {
    listener: Post<PasswordFieldEvent>[] = []

    onPasswordFieldEvent(post: Post<PasswordFieldEvent>): void {
        this.listener.push(post)
    }
    postPasswordFieldEvent(event: PasswordFieldEvent): void {
        this.listener.forEach(post => post(event))
    }
}

interface Post<T> {
    (event: T): void
}
