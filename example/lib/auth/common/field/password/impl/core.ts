import { PasswordFieldPod, PasswordField } from "../action"

import { markPassword } from "../../../password/data"
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
import { InputValue, markInputValue, validContent, invalidContent, hasError } from "../../data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

function validatePassword(password: string): PasswordFieldError[] {
    if (password.length === 0) {
        return ERROR.empty
    }

    if (new TextEncoder().encode(password).byteLength > PASSWORD_MAX_BYTES) {
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
        const result = hasError(validatePassword(this.password))

        post({
            type: "succeed-to-update",
            result,
            content: result.valid ? validContent(markPassword(this.password)) : invalidContent(),
            character: checkCharacter(this.password),
            view: this.view(),
        })
    }
}

export const passwordField: PasswordFieldPod = () => new Field()

interface Post<T> {
    (event: T): void
}
