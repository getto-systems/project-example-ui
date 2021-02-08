import { ApplicationBaseComponent } from "../../../../sub/getto-example/application/impl"

import {
    LoginIDFieldComponentFactory,
    LoginIDFieldMaterial,
    LoginIDFieldComponent,
    LoginIDFieldState,
    LoginIDFormFieldComponentFactory,
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "./component"

import { LoginIDFieldEvent } from "../../../common/field/loginID/event"

import { InputValue } from "../../../common/field/data"
import {
    FormFieldEmptyState,
    FormFieldHandler,
    FormInputComponent,
} from "../../../../sub/getto-form/component/component"
import { FormFieldBaseComponent } from "../../../../sub/getto-form/component/impl"
import { LoginIDValidationError } from "../../../common/field/loginID/data"

export const initLoginIDFormFieldComponent: LoginIDFormFieldComponentFactory = (material) => (handler) =>
    new FieldComponent(material, handler)

class FieldComponent
    extends FormFieldBaseComponent<FormFieldEmptyState, LoginIDValidationError>
    implements LoginIDFormFieldComponent {
    readonly input: FormInputComponent

    constructor(material: LoginIDFormFieldMaterial, handler: FormFieldHandler) {
        super(handler, {
            state: () => ({ result: material.field.validate() }),
        })
        this.input = this.initInput("input", material.field)

        this.addTerminateHandler(() => this.input.terminate())
    }
}

export const initLoginIDFieldComponent: LoginIDFieldComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<LoginIDFieldState> implements LoginIDFieldComponent {
    material: LoginIDFieldMaterial

    constructor(material: LoginIDFieldMaterial) {
        super()
        this.material = material
    }

    set(inputValue: InputValue): void {
        this.material.loginID.set(inputValue, (event) => {
            this.post(event)
        })
    }
    validate(handler: Handler<LoginIDFieldEvent>): void {
        this.material.loginID.validate((event) => {
            this.post(event)
            handler(event)
        })
    }
}

interface Handler<S> {
    (state: S): void
}
