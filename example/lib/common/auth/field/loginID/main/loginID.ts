import { loginIDFormField } from "../impl/field"

import { LoginIDFormFieldAction } from "../action"

export function initLoginIDFormFieldAction(): LoginIDFormFieldAction {
    return {
        field: loginIDFormField(),
    }
}
