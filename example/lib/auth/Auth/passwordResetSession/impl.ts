import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import { LoginLink } from "../link"

import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionMaterial,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
} from "./component"

import { SessionID } from "../../profile/passwordReset/data"

export const initPasswordResetSessionComponent: PasswordResetSessionComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<PasswordResetSessionState> implements PasswordResetSessionComponent {
    material: PasswordResetSessionMaterial

    link: LoginLink

    constructor(material: PasswordResetSessionMaterial) {
        super()
        this.material = material
        this.link = material.link
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
