import { packInputValue, unpackInputValue } from "../../../field/adapter"
import { packLoginID } from "../../../login_id/adapter"

import {
    LoginIDFieldAction,
} from "../action"

import { LoginIDFieldEvent, LoginIDFieldError } from "../data"
import { InputValue, buildContent, hasError } from "../../../field/data"

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
        this.loginID = packInputValue("")
    }

    set(input: InputValue, post: Post<LoginIDFieldEvent>): void {
        this.loginID = input
        this.validate(post)
    }
    validate(post: Post<LoginIDFieldEvent>): void {
        const loginID = unpackInputValue(this.loginID)
        const result = hasError(validateLoginID(loginID))

        post({ type: "succeed-to-update", result, content: buildContent(result.valid, () => packLoginID(loginID)) })
    }
}

export function initLoginIDFieldAction(): LoginIDFieldAction {
    return new Field()
}

interface Post<T> {
    (state: T): void
}
