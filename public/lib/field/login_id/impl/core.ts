import { LoginIDFieldAction, LoginIDField, LoginIDFieldEventHandler } from "../action"

import { LoginIDFieldError } from "../data"
import { LoginID } from "../../../credential/data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../../input/data"

export function initLoginIDFieldAction(): LoginIDFieldAction {
    return new Action()
}

class Action implements LoginIDFieldAction {
    initLoginIDField(handler: LoginIDFieldEventHandler): LoginIDField {
        return new Field(handler)
    }
}

class Field implements LoginIDField {
    handler: LoginIDFieldEventHandler

    loginID: InputValue

    constructor(handler: LoginIDFieldEventHandler) {
        this.handler = handler

        this.loginID = { inputValue: "" }
    }

    set(input: InputValue): void {
        this.loginID = input
        this.validate()
    }
    validate(): void {
        const [content, valid] = this.content()
        this.handler.handleLoginIDFieldEvent({ type: "succeed-to-update-login-id", valid, content })
    }

    content(): [Content<LoginID>, Valid<LoginIDFieldError>] {
        const result = hasError(validateLoginID(this.loginID.inputValue))
        if (!result.valid) {
            return [invalidContent(this.loginID), result]
        }
        return [validContent(this.loginID, { loginID: this.loginID.inputValue }), result]
    }
}

const ERROR: {
    ok: Array<LoginIDFieldError>,
    empty: Array<LoginIDFieldError>,
} = {
    ok: [],
    empty: ["empty"],
}

function validateLoginID(loginID: string): Array<LoginIDFieldError> {
    if (loginID.length === 0) {
        return ERROR.empty
    }

    return ERROR.ok
}
