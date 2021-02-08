import { initFormField } from "../../../../../sub/getto-form/action/impl/field"
import { initFormInput } from "../../../../../sub/getto-form/action/impl/input"
import { LoginIDFormFieldPod } from "../action"
import { convertLoginID } from "./converter"
import { validateLoginID } from "./validator"

export const loginIDFormField = (): LoginIDFormFieldPod => () =>
    initFormField({
        input: initFormInput(),
        validator: validateLoginID,
        converter: convertLoginID,
    })
