import { ApplicationBaseComponent } from "../../../../sub/getto-example/application/impl"

import {
    PasswordFieldComponentFactory,
    PasswordFieldMaterial,
    PasswordFieldComponent,
    PasswordFieldState,
} from "./component"

import { PasswordFieldEvent } from "../../../common/field/password/event"

import { InputValue } from "../../../common/field/data"

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
    validate(post: Post<PasswordFieldEvent>): void {
        this.material.password.validate((event) => {
            this.post(event)
            post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
