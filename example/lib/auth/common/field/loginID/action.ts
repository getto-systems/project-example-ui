import { FormField } from "../../../../sub/getto-form/form/action"

import { LoginID } from "../../loginID/data"
import { LoginIDValidationError, LoginIDInput } from "./data"

export type LoginIDFormFieldAction = Readonly<{
    field: LoginIDFormFieldPod
}>

export interface LoginIDFormFieldPod {
    (): LoginIDFormField
}
export type LoginIDFormField = FormField<LoginID, LoginIDValidationError, LoginIDInput>
