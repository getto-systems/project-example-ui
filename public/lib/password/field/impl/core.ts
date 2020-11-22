import { packInputValue, unpackInputValue } from "../../../field/adapter"
import { packPassword } from "../../../password/adapter"

import { PasswordField, PasswordFieldAction } from "../action"

import {
    PasswordFieldEvent,
    PasswordFieldError,
    PasswordCharacter,
    simplePassword,
    complexPassword,
    PasswordView,
    showPassword,
    hidePassword,
} from "../data"
import { InputValue, buildContent, hasError } from "../../../field/data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

function validatePassword(password: string): PasswordFieldError[] {
    if (password.length === 0) {
        return ERROR.empty
    }

    if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) {
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
    password: InputValue
    visible: boolean

    constructor() {
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

    set(input: InputValue, post: Post<PasswordFieldEvent>): void {
        this.password = input
        this.validate(post)
    }
    show(post: Post<PasswordFieldEvent>): void {
        this.visible = true
        this.validate(post)
    }
    hide(post: Post<PasswordFieldEvent>): void {
        this.visible = false
        this.validate(post)
    }
    validate(post: Post<PasswordFieldEvent>): void {
        const password = unpackInputValue(this.password)
        const result = hasError(validatePassword(password))

        post({
            type: "succeed-to-update",
            result,
            content: buildContent(result.valid, () => packPassword(password)),
            character: checkCharacter(password),
            view: this.view(),
        })
    }
}

export const passwordField: PasswordField = () => new Field()

interface Post<T> {
    (event: T): void
}
