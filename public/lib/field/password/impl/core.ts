import {
    PasswordFieldAction,
    PasswordField,
    PasswordFieldEventPublisher,
    PasswordFieldEventSubscriber,
} from "../action"

import {
    PasswordFieldEvent,
    PasswordFieldError,
    PasswordCharacter, simplePassword, complexPassword,
    PasswordView, showPassword, hidePassword,
} from "../data"
import { Password } from "../../../password/data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../../input/data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

export function initPasswordFieldAction(): PasswordFieldAction {
    return new Action()
}

class Action implements PasswordFieldAction {
    initPasswordField(): PasswordField {
        return new Field()
    }
}

class Field implements PasswordField {
    pub: PasswordFieldEventPublisher
    sub: PasswordFieldEventSubscriber

    password: InputValue
    visible: boolean

    constructor() {
        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub

        this.password = { inputValue: "" }
        this.visible = false
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
    validate(): void {
        const [content, result, character, view] = this.content()
        this.pub.publishPasswordFieldEvent({ type: "succeed-to-update-password", result, content, character, view })
    }

    content(): [Content<Password>, Valid<PasswordFieldError>, PasswordCharacter, PasswordView] {
        const result = hasError(validatePassword(this.password.inputValue))
        const character = checkCharacter(this.password.inputValue)
        const view = this.view()
        if (!result.valid) {
            return [invalidContent(this.password), result, character, view]
        }
        return [validContent(this.password, { password: this.password.inputValue }), result, character, view]
    }
    view(): PasswordView {
        if (this.visible) {
            return showPassword(this.password)
        } else {
            return hidePassword
        }
    }
}

class EventPubSub implements PasswordFieldEventPublisher, PasswordFieldEventSubscriber {
    holder: {
        field: PublisherHolder<PasswordFieldEvent>
        content: PublisherHolder<Content<Password>>
    }

    constructor() {
        this.holder = {
            field: { set: false },
            content: { set: false },
        }
    }

    onPasswordFieldStateChanged(pub: Publisher<PasswordFieldEvent>): void {
        this.holder.field = { set: true, pub }
    }
    onPasswordFieldContentChanged(pub: Publisher<Content<Password>>): void {
        this.holder.content = { set: true, pub }
    }

    publishPasswordFieldEvent(event: PasswordFieldEvent): void {
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
    ok: Array<PasswordFieldError>,
    empty: Array<PasswordFieldError>,
    tooLong: Array<PasswordFieldError>,
} = {
    ok: [],
    empty: ["empty"],
    tooLong: ["too-long"],
}

function validatePassword(password: string): Array<PasswordFieldError> {
    if (password.length === 0) {
        return ERROR.empty
    }

    if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
        return ERROR.tooLong
    }

    return []
}
function checkCharacter(password: string): PasswordCharacter {
    for (let i = 0; i < password.length; i++) {
        if (password.charCodeAt(i) >= 128) {
            return complexPassword
        }
    }
    return simplePassword
}
