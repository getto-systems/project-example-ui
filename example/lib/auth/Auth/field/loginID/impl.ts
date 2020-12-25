import {
    LoginIDFieldComponentFactory,
    LoginIDFieldMaterial,
    LoginIDFieldComponent,
    LoginIDFieldState,
} from "./component"

import { LoginIDFieldEvent } from "../../../common/field/loginID/data"
import { InputValue } from "../../../common/field/data"

export const initLoginIDFieldComponent: LoginIDFieldComponentFactory = (material) =>
    new Component(material)

class Component implements LoginIDFieldComponent {
    material: LoginIDFieldMaterial

    listener: Post<LoginIDFieldState>[] = []

    constructor(material: LoginIDFieldMaterial) {
        this.material = material
    }

    onStateChange(post: Post<LoginIDFieldState>): void {
        this.listener.push(post)
    }
    post(state: LoginIDFieldState): void {
        this.listener.forEach((post) => post(state))
    }

    set(inputValue: InputValue): void {
        this.material.loginID.set(inputValue, (event) => {
            this.post(this.mapLoginIDFieldEvent(event))
        })
    }
    validate(post: Post<LoginIDFieldEvent>): void {
        this.material.loginID.validate((event) => {
            this.post(this.mapLoginIDFieldEvent(event))
            post(event)
        })
    }

    mapLoginIDFieldEvent(event: LoginIDFieldEvent): LoginIDFieldState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
