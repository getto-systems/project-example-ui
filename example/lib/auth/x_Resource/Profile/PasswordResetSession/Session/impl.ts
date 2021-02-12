import { ApplicationBaseComponent } from "../../../../../sub/getto-example/x_components/Application/impl"

import { LoginLink } from "../../../common/link"

import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionMaterial,
    PasswordResetSessionComponent,
    PasswordResetSessionComponentState,
} from "./component"

import { SessionID, StartSessionFields } from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"

export const initPasswordResetSessionComponent: PasswordResetSessionComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationBaseComponent<PasswordResetSessionComponentState>
    implements PasswordResetSessionComponent {
    material: PasswordResetSessionMaterial

    link: LoginLink

    constructor(material: PasswordResetSessionMaterial) {
        super()
        this.material = material
        this.link = material.link
    }

    startSession(fields: FormConvertResult<StartSessionFields>): void {
        this.material.startSession(fields, (event) => {
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
