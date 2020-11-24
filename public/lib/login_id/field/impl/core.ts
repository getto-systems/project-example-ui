import { packLoginID } from "../../../login_id/adapter"

import { LoginIDField, LoginIDFieldAction } from "../action"

import { LoginIDFieldEvent, LoginIDFieldError } from "../data"
import { InputValue, markInputValue, buildContent, hasError } from "../../../field/data"

function validateLoginID(loginID: string): LoginIDFieldError[] {
    if (loginID.length === 0) {
        return ERROR.empty
    }

    return ERROR.ok
}

const ERROR: {
    ok: LoginIDFieldError[]
    empty: LoginIDFieldError[]
} = {
    ok: [],
    empty: ["empty"],
}

class Field implements LoginIDFieldAction {
    loginID: InputValue

    constructor() {
        this.loginID = markInputValue("")
    }

    set(input: InputValue, post: Post<LoginIDFieldEvent>): void {
        this.loginID = input
        this.validate(post)
    }
    validate(post: Post<LoginIDFieldEvent>): void {
        const result = hasError(validateLoginID(this.loginID))

        post({
            type: "succeed-to-update",
            result,
            // TODO buildContent きもちわるい
            content: buildContent(result.valid, () => packLoginID(this.loginID)),
        })
    }
}

export const loginIDField: LoginIDField = () => new Field()

interface Post<T> {
    (state: T): void
}
