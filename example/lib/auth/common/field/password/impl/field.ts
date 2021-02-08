import { initFormField } from "../../../../../sub/getto-form/action/impl/field"
import { initFormInput } from "../../../../../sub/getto-form/action/impl/input"
import { PasswordFormFieldPod } from "../action"
import { convertPassword } from "./converter"
import { validatePassword } from "./validator"

export const passwordFormField = (): PasswordFormFieldPod => () =>
    initFormField({
        input: initFormInput(),
        validator: validatePassword,
        converter: convertPassword,
    })
