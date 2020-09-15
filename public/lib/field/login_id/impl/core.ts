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

    async set(input: InputValue): Promise<void> {
        this.loginID = input
        this.validate()
    }
    async validate(): Promise<void> {
        const [valid, content] = this.toLoginID()
        this.handler.handleLoginIDFieldEvent({ type: "succeed-to-update-login-id", valid, content })
    }

    toLoginID(): [Valid<LoginIDFieldError>, Content<LoginID>] {
        const result = hasError(validateLoginID(this.loginID.inputValue))
        if (!result.valid) {
            return [result, invalidContent(this.loginID)]
        }
        return [result, validContent(this.loginID, { loginID: this.loginID.inputValue })]
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
