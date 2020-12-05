import { PasswordResetMaterial, PasswordResetComponent, PasswordResetState } from "./component"

import { ResetEvent } from "../../profile/password_reset/data"
import { StoreEvent } from "../../login/renew/data"
import { LoadError } from "../../common/application/data"
import { LoginLink } from "../link"

export function initPasswordReset(material: PasswordResetMaterial): PasswordResetComponent {
    return new Component(material)
}

class Component implements PasswordResetComponent {
    material: PasswordResetMaterial

    listener: Post<PasswordResetState>[] = []

    link: LoginLink

    constructor(material: PasswordResetMaterial) {
        this.material = material
        this.link = material.link
    }

    onStateChange(post: Post<PasswordResetState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetState): void {
        this.listener.forEach((post) => post(state))
    }

    reset(): void {
        this.material.reset((event) => {
            this.post(this.mapResetEvent(event))
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    mapResetEvent(event: ResetEvent): PasswordResetState {
        switch (event.type) {
            case "succeed-to-reset":
                this.material.store(event.authCredential, (event) => {
                    this.post(this.mapStoreEvent(event))
                })
                return {
                    type: event.type,
                    scriptPath: this.material.secureScriptPath(),
                }

            default:
                return event
        }
    }
    mapStoreEvent(event: StoreEvent): PasswordResetState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
