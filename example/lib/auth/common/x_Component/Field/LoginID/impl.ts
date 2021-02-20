import {
    LoginIDFormFieldComponentFactory,
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "./component"

import {
    FormFieldEmptyState,
    FormFieldHandler,
    FormInputComponent,
} from "../../../../../z_getto/getto-form/x_Resource/Form/component"
import { FormFieldBaseComponent } from "../../../../../z_getto/getto-form/x_Resource/Form/impl"
import { LoginIDValidationError } from "../../../field/loginID/data"

export const initLoginIDFormFieldComponent: LoginIDFormFieldComponentFactory = (material) => (handler) =>
    new Component(material, handler)

class Component
    extends FormFieldBaseComponent<FormFieldEmptyState, LoginIDValidationError>
    implements LoginIDFormFieldComponent {
    readonly input: FormInputComponent

    constructor(material: LoginIDFormFieldMaterial, handler: FormFieldHandler) {
        super(handler, {
            state: () => ({ result: material.loginID.validate() }),
        })
        this.input = this.initInput("input", material.loginID)

        this.terminateHook(() => this.input.terminate())
    }
}
