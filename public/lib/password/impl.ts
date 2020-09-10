import { PasswordAction, PasswordField, PasswordEvent } from "./action"

import {
    Password, PasswordError,
    PasswordCharacter, simplePassword, complexPassword,
    PasswordView, showPassword, hidePassword,
} from "./data"
import {
    InputValue,
    Content, validContent, invalidContent,
    Valid, noError, hasError,
} from "../input/data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

export function initPasswordAction(): PasswordAction {
    return new PasswordActionImpl()
}

class PasswordActionImpl implements PasswordAction {
    initPasswordField(): PasswordField {
        return new PasswordFieldImpl()
    }
}

class PasswordFieldImpl implements PasswordField {
    password: InputValue
    visible: boolean

    constructor() {
        this.password = { inputValue: "" }
        this.visible = false
    }

    initialState(): [Valid<PasswordError>, PasswordCharacter, PasswordView] {
        return [noError(), { complex: false }, { show: false }]
    }

    setPassword(event: PasswordEvent, input: InputValue): void {
        this.password = input
        this.validate(event)
    }
    showPassword(event: PasswordEvent): void {
        this.visible = true
        this.validate(event)
    }
    hidePassword(event: PasswordEvent): void {
        this.visible = false
        this.validate(event)
    }
    validate(event: PasswordEvent): Content<Password> {
        const state = this.state()
        event.updated(...state)
        return this.content(state[0])
    }

    toPassword(): Content<Password> {
        return this.content(this.state()[0])
    }
    view(): PasswordView {
        if (this.visible) {
            return showPassword(this.password)
        } else {
            return hidePassword
        }
    }

    state(): [Valid<PasswordError>, PasswordCharacter, PasswordView] {
        const result = hasError(validatePassword(this.password.inputValue))
        return [result, checkCharacter(this.password.inputValue), this.view()]
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
