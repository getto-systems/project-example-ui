import { loginIDFormField } from "../../../../../common/field/loginID/impl/field"
import { passwordCharacterChecker } from "../../../../../common/field/password/impl/character"
import { passwordFormField } from "../../../../../common/field/password/impl/field"
import { passwordViewer } from "../../../../../common/field/password/impl/viewer"

import { LoginIDFormFieldAction } from "../../../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../../../common/field/password/action"

export function initLoginIDFormFieldAction(): LoginIDFormFieldAction {
    return {
        field: loginIDFormField(),
    }
}
export function initPasswordFormFieldAction(): PasswordFormFieldAction {
    return {
        field: passwordFormField(),
        character: passwordCharacterChecker(),
        viewer: passwordViewer(),
    }
}
