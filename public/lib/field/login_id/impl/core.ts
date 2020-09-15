import { LoginIDFieldAction, LoginIDField, LoginIDFieldEvent } from "../action"

import { LoginIDFieldError } from "../data"
import { LoginID } from "../../../credential/data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../../input/data"

export function initLoginIDFieldAction(): LoginIDFieldAction {
    return {
        initLoginIDField(): LoginIDField {
            return new LoginIDFieldImpl()
        },
    }
}

class LoginIDFieldImpl implements LoginIDField {
    loginID: InputValue

    constructor() {
        this.loginID = { inputValue: "" }
    }

    set(event: LoginIDFieldEvent, input: InputValue): Content<LoginID> {
        this.loginID = input
        return this.validate(event)
    }
    validate(event: LoginIDFieldEvent): Content<LoginID> {
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
