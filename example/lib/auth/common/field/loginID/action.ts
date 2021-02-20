import { FormField } from "../../../../z_getto/getto-form/form/action"

import { LoginID } from "../../loginID/data"
import { LoginIDValidationError, LoginIDInput } from "./data"

// TODO Action の調整をする
export type LoginIDFormFieldAction = Readonly<{
    field: LoginIDFormFieldPod
}>

export interface LoginIDFormFieldPod {
    (): LoginIDFormField
}
export type LoginIDFormField = FormField<LoginID, LoginIDValidationError, LoginIDInput>
