import {
    PasswordResetSessionMaterial,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
} from "./component"

import { StartSessionEvent, CheckStatusEvent } from "../../profile/password_reset/data"
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
            this.post(this.mapStartSessionEvent(event))
        })
    }

    mapStartSessionEvent(event: StartSessionEvent): PasswordResetSessionState {
        switch (event.type) {
            case "succeed-to-start-session":
                this.material.checkStatus(event.sessionID, (event) => {
                    this.post(this.mapCheckStatusEvent(event))
                })
                return { type: "try-to-check-status" }

            default:
                return event
        }
    }
    mapCheckStatusEvent(event: CheckStatusEvent): PasswordResetSessionState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
