import { initFormField } from "../../../../../common/vendor/getto-form/form/impl/field"
import { initFormInput } from "../../../../../common/vendor/getto-form/form/impl/input"
import { PasswordFormFieldPod } from "../action"
import { convertPassword } from "./converter"
import { validatePassword } from "./validator"

export const passwordFormField = (): PasswordFormFieldPod => () =>
    initFormField({
        input: initFormInput(),
        validator: validatePassword,
        converter: convertPassword,
    })
