import {
    PasswordResetSessionMaterial,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
} from "./component"

import { SessionID } from "../../profile/password_reset/data"
import { LoginLink } from "../link"

export function initPasswordResetSession(
    material: PasswordResetSessionMaterial
): PasswordResetSessionComponent {
    return new Component(material)
}

class Component implements PasswordResetSessionComponent {
    material: PasswordResetSessionMaterial

    listener: Post<PasswordResetSessionState>[] = []

    link: LoginLink

    constructor(material: PasswordResetSessionMaterial) {
        this.material = material
        this.link = material.link
    }

    onStateChange(post: Post<PasswordResetSessionState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetSessionState): void {
        this.listener.forEach((post) => post(state))
    }

    startSession(): void {
        this.material.startSession((event) => {
            switch (event.type) {
                case "succeed-to-start-session":
                    this.checkStatus(event.sessionID)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }

    checkStatus(sessionID: SessionID): void {
        this.material.checkStatus(sessionID, (event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
