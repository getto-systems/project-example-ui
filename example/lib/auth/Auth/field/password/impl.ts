import {
    PasswordFieldComponentFactory,
    PasswordFieldMaterial,
    PasswordFieldComponent,
    PasswordFieldState,
} from "./component"

import { PasswordFieldEvent } from "../../../common/field/password/data"
import { InputValue } from "../../../common/field/data"

export const initPasswordFieldComponent: PasswordFieldComponentFactory = (material) =>
    new Component(material)

class Component implements PasswordFieldComponent {
    material: PasswordFieldMaterial

    listener: Post<PasswordFieldState>[] = []

    constructor(material: PasswordFieldMaterial) {
        this.material = material
    }

    onStateChange(post: Post<PasswordFieldState>): void {
        this.listener.push(post)
    }
    post(state: PasswordFieldState): void {
        this.listener.forEach((post) => post(state))
    }

    set(inputValue: InputValue): void {
        this.material.password.set(inputValue, (event) => {
            this.post(this.mapPasswordFieldEvent(event))
        })
    }
    show(): void {
        this.material.password.show((event) => {
            this.post(this.mapPasswordFieldEvent(event))
        })
    }
    hide(): void {
        this.material.password.hide((event) => {
            this.post(this.mapPasswordFieldEvent(event))
        })
    }
    validate(post: Post<PasswordFieldEvent>): void {
        this.material.password.validate((event) => {
            this.post(this.mapPasswordFieldEvent(event))
            post(event)
        })
    }

    mapPasswordFieldEvent(event: PasswordFieldEvent): PasswordFieldState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
