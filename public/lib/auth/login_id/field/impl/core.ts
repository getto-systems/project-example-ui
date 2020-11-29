import { LoginIDField, LoginIDFieldAction } from "../action"

import { markLoginID } from "../../data"
import { LoginIDFieldEvent, LoginIDFieldError } from "../data"
import { InputValue, markInputValue, validContent, invalidContent, hasError } from "../../../field/data"

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
            content: result.valid ? validContent(markLoginID(this.loginID)) : invalidContent(),
        })
    }
}

export const loginIDField: LoginIDField = () => new Field()

interface Post<T> {
    (state: T): void
}
