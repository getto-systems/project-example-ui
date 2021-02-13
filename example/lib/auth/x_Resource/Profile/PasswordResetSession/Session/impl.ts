import { ApplicationBaseComponent } from "../../../../../common/getto-example/Application/impl"

import {
    SessionComponentFactory,
    SessionMaterial,
    SessionComponent,
    SessionComponentState,
} from "./component"

import { SessionID, StartSessionFields } from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../common/getto-form/form/data"

export const initSessionComponent: SessionComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<SessionComponentState> implements SessionComponent {
    material: SessionMaterial

    constructor(material: SessionMaterial) {
        super()
        this.material = material
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
