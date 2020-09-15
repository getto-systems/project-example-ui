import { PasswordFieldAction, PasswordField, PasswordFieldEvent } from "../action"

import {
    PasswordError,
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
    password: InputValue
    visible: boolean

    constructor() {
        this.password = { inputValue: "" }
        this.visible = false
    }

    set(event: PasswordFieldEvent, input: InputValue): Content<Password> {
        this.password = input
        return this.validate(event)
    }
    show(event: PasswordFieldEvent): void {
        this.visible = true
        this.validate(event)
    }
    hide(event: PasswordFieldEvent): void {
        this.visible = false
        this.validate(event)
    }
    validate(event: PasswordFieldEvent): Content<Password> {
        const state = this.state()
        event.updated(...state)
        return this.content(state[0])
    }

    state(): [Valid<PasswordError>, PasswordCharacter, PasswordView] {
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
    content(result: Valid<PasswordError>): Content<Password> {
        if (!result.valid) {
            return invalidContent(this.password)
        }
        return validContent(this.password, { password: this.password.inputValue })
    }
}

const ERROR: {
    ok: Array<PasswordError>,
    empty: Array<PasswordError>,
    tooLong: Array<PasswordError>,
} = {
    ok: [],
    empty: ["empty"],
    tooLong: ["too-long"],
}

function validatePassword(password: string): Array<PasswordError> {
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