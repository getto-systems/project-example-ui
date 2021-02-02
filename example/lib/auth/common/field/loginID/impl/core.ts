import { LoginIDFieldPod, LoginIDField } from "../action"

import { LoginIDFieldEvent } from "../event"

import { markLoginID } from "../../../loginID/data"
import { LoginIDFieldError } from "../data"
import { InputValue, markInputValue, validContent, invalidContent, hasError } from "../../data"

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

class Field implements LoginIDField {
    loginID: InputValue

    constructor() {
        this.loginID = markInputValue("")
    }

    set(input: InputValue, post: Handler<LoginIDFieldEvent>): void {
        this.loginID = input
        this.validate(post)
    }
    validate(handler: Handler<LoginIDFieldEvent>): void {
        const result = hasError(validateLoginID(this.loginID))

        handler({
            type: "succeed-to-update",
            result,
            content: result.valid ? validContent(markLoginID(this.loginID)) : invalidContent(),
        })
    }
}

export const loginIDField: LoginIDFieldPod = () => new Field()

interface Handler<E> {
    (event: E): void
}
