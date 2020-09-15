import { PasswordFieldAction, PasswordField, PasswordFieldEventHandler } from "../action"

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
        const [content, result, character, view] = this.content()
        this.handler.handlePasswordFieldEvent({ type: "succeed-to-update-login-id", result, content, character, view })
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
