import { ApplicationBaseComponent } from "../../../../sub/getto-example/application/impl"

import {
    LoginIDFieldComponentFactory,
    LoginIDFieldMaterial,
    LoginIDFieldComponent,
    LoginIDFieldState,
} from "./component"

import { LoginIDFieldEvent } from "../../../common/field/loginID/event"

import { InputValue } from "../../../common/field/data"

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
    validate(post: Post<LoginIDFieldEvent>): void {
        this.material.loginID.validate((event) => {
            this.post(event)
            post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
