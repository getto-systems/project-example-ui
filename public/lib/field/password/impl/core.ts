import { PasswordFieldAction, PasswordField, PasswordFieldEventHandler, PasswordFieldDeprecated, PasswordFieldEventPublisher } from "../action"

import {
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
    initPasswordField(handler: PasswordFieldEventHandler): PasswordField {
        return new Field(handler)
    }
    initPasswordFieldDeprecated(): PasswordFieldDeprecated {
        return new FieldDeprecated()
    }
}

class Field implements PasswordField {
    handler: PasswordFieldEventHandler

    password: InputValue
    visible: boolean

    constructor(handler: PasswordFieldEventHandler) {
        this.handler = handler

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
        const [content, valid, character, view] = this.content()
        this.handler.handlePasswordFieldEvent({ type: "succeed-to-update-login-id", valid, content, character, view })
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

class FieldDeprecated implements PasswordFieldDeprecated {
    password: InputValue
    visible: boolean

    constructor() {
        this.password = { inputValue: "" }
        this.visible = false
    }

    set(event: PasswordFieldEventPublisher, input: InputValue): Content<Password> {
        this.password = input
        return this.validate(event)
    }
    show(event: PasswordFieldEventPublisher): void {
        this.visible = true
        this.validate(event)
    }
    hide(event: PasswordFieldEventPublisher): void {
        this.visible = false
        this.validate(event)
    }
    validate(event: PasswordFieldEventPublisher): Content<Password> {
        const state = this.state()
        event.updated(...state)
        return this.content(state[0])
    }

    state(): [Valid<PasswordFieldError>, PasswordCharacter, PasswordView] {
        const result = hasError(validatePassword(this.password.inputValue))
        return [result, checkCharacter(this.password.inputValue), this.view()]
    }
    view(): PasswordView {
        if (this.visible) {
            return showPassword(this.password)
        } else {
            return hidePassword
        }
    }
    content(result: Valid<PasswordFieldError>): Content<Password> {
        if (!result.valid) {
            return invalidContent(this.password)
        }
        return validContent(this.password, { password: this.password.inputValue })
    }
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
