import { VNode } from "preact"
import { html } from "htm/preact"

import { LoginIDFieldError } from "../../../field/login_id/data"
import { Valid } from "../../../field/data"

export function loginIDFieldError(result: Valid<LoginIDFieldError>): VNode[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return html`<p class="form__message">ログインIDを入力してください</p>`
        }
    })
}
