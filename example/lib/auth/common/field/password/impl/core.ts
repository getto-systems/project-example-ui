import { PasswordFieldPod, PasswordField } from "../action"

import { PasswordFieldEvent } from "../event"

import { markPassword } from "../../../password/data"
import { PasswordValidationError, PasswordCharacter, PasswordView, showPassword } from "../data"
import { InputValue, markInputValue, validContent, invalidContent, hasError } from "../../data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

function validatePassword(password: string): PasswordValidationError[] {
    if (password.length === 0) {
        return ERROR.empty
    }

    if (new TextEncoder().encode(password).byteLength > PASSWORD_MAX_BYTES) {
        return ERROR.tooLong
    }

    return ERROR.ok
}

const ERROR: {
    ok: PasswordValidationError[]
    empty: PasswordValidationError[]
    tooLong: PasswordValidationError[]
} = {
    ok: [],
    empty: ["empty"],
    tooLong: ["too-long"],
}

function checkCharacter(password: string): PasswordCharacter {
    for (let i = 0; i < password.length; i++) {
        // 1文字でも 128バイト以上の文字があれば complex
        if (password.charCodeAt(i) >= 128) {
            return { complex: true }
        }
    }
    return { complex: false }
}

class Field implements PasswordField {
    password: InputValue
    visible: boolean

    constructor() {
        this.password = markInputValue("")
        this.visible = false
    }

    view(): PasswordView {
        if (this.visible) {
            return showPassword(this.password)
        } else {
            return { show: false }
        }
    }

    set(input: InputValue, post: Handler<PasswordFieldEvent>): void {
        this.password = input
        this.validate(post)
    }
    show(post: Handler<PasswordFieldEvent>): void {
        this.visible = true
        this.validate(post)
    }
    hide(post: Handler<PasswordFieldEvent>): void {
        this.visible = false
        this.validate(post)
    }
    validate(handler: Handler<PasswordFieldEvent>): void {
        const result = hasError(validatePassword(this.password))

        handler({
            type: "succeed-to-update",
            result,
            content: result.valid ? validContent(markPassword(this.password)) : invalidContent(),
            character: checkCharacter(this.password),
            view: this.view(),
        })
    }
}

export const passwordField: PasswordFieldPod = () => new Field()

interface Handler<E> {
    (event: E): void
}
