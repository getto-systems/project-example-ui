import { passwordCharacterChecker } from "../impl/character"
import { passwordFormField } from "../impl/field"
import { passwordViewer } from "../impl/viewer"

import { PasswordFormFieldAction } from "../action"

export function initPasswordFormFieldAction(): PasswordFormFieldAction {
    return {
        field: passwordFormField(),
        character: passwordCharacterChecker(),
        viewer: passwordViewer(),
    }
}
