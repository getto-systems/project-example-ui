import { ApplicationBaseComponent } from "../../../../sub/getto-example/application/impl"
import { FormFieldBaseComponent } from "../../../../sub/getto-form/component/impl"

import {
    PasswordFieldComponentFactory,
    PasswordFieldMaterial,
    PasswordFieldComponent,
    PasswordFieldState,
    PasswordFormFieldComponentFactory,
    PasswordState,
    PasswordFormFieldComponent,
    PasswordFormFieldMaterial,
} from "./component"
import { FormFieldHandler, FormInputComponent } from "../../../../sub/getto-form/component/component"

import { PasswordFieldEvent } from "../../../common/field/password/event"

import { InputValue } from "../../../common/field/data"
import { PasswordValidationError, PasswordView } from "../../../common/field/password/data"

export const initPasswordFormFieldComponent: PasswordFormFieldComponentFactory = (material) => (
    handler
) => new FieldComponent(material, handler)

class FieldComponent
    extends FormFieldBaseComponent<PasswordState, PasswordValidationError>
    implements PasswordFormFieldComponent {
    material: PasswordFormFieldMaterial
    readonly input: FormInputComponent

    constructor(material: PasswordFormFieldMaterial, handler: FormFieldHandler) {
        super(handler, {
            state: () => {
                const password = material.field.input.get()
                return {
                    result: material.field.validate(),
                    character: material.checker(password),
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
        this.input = this.initInput("input", material.field)

        this.addTerminateHandler(() => this.input.terminate())
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

export const initPasswordFieldComponent: PasswordFieldComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<PasswordFieldState> implements PasswordFieldComponent {
    material: PasswordFieldMaterial

    constructor(material: PasswordFieldMaterial) {
        super()
        this.material = material
    }

    set(inputValue: InputValue): void {
        this.material.password.set(inputValue, (event) => {
            this.post(event)
        })
    }
    show(): void {
        this.material.password.show((event) => {
            this.post(event)
        })
    }
    hide(): void {
        this.material.password.hide((event) => {
            this.post(event)
        })
    }
    validate(handler: Handler<PasswordFieldEvent>): void {
        this.material.password.validate((event) => {
            this.post(event)
            handler(event)
        })
    }
}

interface Handler<S> {
    (state: S): void
}
