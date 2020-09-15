import { LoginIDFieldAction, LoginIDField, LoginIDFieldEventHandler, LoginIDFieldDeprecated, LoginIDFieldEventPublisher } from "../action"

import { LoginIDFieldError } from "../data"
import { LoginID } from "../../../credential/data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../../input/data"

export function initLoginIDFieldAction(handler: LoginIDFieldEventHandler): LoginIDFieldAction {
    return new Action(handler)
}

class Action implements LoginIDFieldAction {
    handler: LoginIDFieldEventHandler

    constructor(handler: LoginIDFieldEventHandler) {
        this.handler = handler
    }

    initLoginIDField(): LoginIDField {
        return new Field(this.handler)
    }
    initLoginIDFieldDeprecated(): LoginIDFieldDeprecated {
        return new FieldDeprecated()
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

class FieldDeprecated implements LoginIDFieldDeprecated {
    loginID: InputValue

    constructor() {
        this.loginID = { inputValue: "" }
    }

    set(event: LoginIDFieldEventPublisher, input: InputValue): Content<LoginID> {
        this.loginID = input
        return this.validate(event)
    }
    validate(event: LoginIDFieldEventPublisher): Content<LoginID> {
        const state = this.state()
        event.updated(...state)
        return this.content(state[0])
    }

    state(): [Valid<LoginIDFieldError>] {
        return [hasError(validateLoginID(this.loginID.inputValue))]
    }
    content(result: Valid<LoginIDFieldError>): Content<LoginID> {
        if (!result.valid) {
            return invalidContent(this.loginID)
        }
        return validContent(this.loginID, { loginID: this.loginID.inputValue })
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
