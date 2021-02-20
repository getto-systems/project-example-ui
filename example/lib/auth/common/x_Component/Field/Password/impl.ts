import { FormFieldBaseComponent } from "../../../../../z_getto/getto-form/x_Resource/Form/impl"

import {
    PasswordFormFieldComponentFactory,
    PasswordState,
    PasswordFormFieldComponent,
    PasswordFormFieldMaterial,
} from "./component"
import {
    FormFieldHandler,
    FormInputComponent,
} from "../../../../../z_getto/getto-form/x_Resource/Form/component"

import { PasswordValidationError, PasswordView } from "../../../field/password/data"

export const initPasswordFormFieldComponent: PasswordFormFieldComponentFactory = (material) => (
    handler
) => new Component(material, handler)

class Component
    extends FormFieldBaseComponent<PasswordState, PasswordValidationError>
    implements PasswordFormFieldComponent {
    material: PasswordFormFieldMaterial
    readonly input: FormInputComponent

    constructor(material: PasswordFormFieldMaterial, handler: FormFieldHandler) {
        super(handler, {
            state: () => {
                const password = material.password.input.get()
                return {
                    result: material.password.validate(),
                    character: material.character(password),
                    view: view(),
                }

                function view(): PasswordView {
                    if (material.viewer.get().show) {
                        return { show: true, password }
                    } else {
                        return { show: false }
                    }
                }
            },
        })
        this.material = material
        this.input = this.initInput("input", material.password)

        this.terminateHook(() => this.input.terminate())
    }

    show(): void {
        this.material.viewer.show(() => {
            this.validate()
        })
    }
    hide(): void {
        this.material.viewer.hide(() => {
            this.validate()
        })
    }
}
