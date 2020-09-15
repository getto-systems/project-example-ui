import { LoginIDFieldAction, LoginIDFieldDeprecated, LoginIDFieldEventPublisher } from "../action"

import { LoginIDFieldError } from "../data"
import { LoginID } from "../../../credential/data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../../input/data"

export function initLoginIDFieldAction(): LoginIDFieldAction {
    return {
        initLoginIDFieldDeprecated(): LoginIDFieldDeprecated {
            return new LoginIDFieldImpl()
        },
    }
}

class LoginIDFieldImpl implements LoginIDFieldDeprecated {
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
