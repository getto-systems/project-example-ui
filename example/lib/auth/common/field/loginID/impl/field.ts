import { initFormField } from "../../../../../common/vendor/getto-form/form/impl/field"
import { initFormInput } from "../../../../../common/vendor/getto-form/form/impl/input"
import { LoginIDFormFieldPod } from "../action"
import { convertLoginID } from "./converter"
import { validateLoginID } from "./validator"

export const loginIDFormField = (): LoginIDFormFieldPod => () =>
    initFormField({
        input: initFormInput(),
        validator: validateLoginID,
        converter: convertLoginID,
    })
