import { ApplicationBaseAction } from "../../../../../../../common/vendor/getto-example/Application/impl"

import { StartComponentFactory, PasswordResetSessionStartMaterial, PasswordResetSessionStartComponent, StartComponentState } from "./component"

import {
    PasswordResetSessionID,
    PasswordResetSessionFields,
} from "../../../../../password/resetSession/start/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"

export const initStartComponent: StartComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseAction<StartComponentState> implements PasswordResetSessionStartComponent {
    material: PasswordResetSessionStartMaterial

    constructor(material: PasswordResetSessionStartMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<PasswordResetSessionFields>): void {
        this.material.session.start(fields, (event) => {
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

    checkStatus(sessionID: PasswordResetSessionID): void {
        this.material.session.checkStatus(sessionID, (event) => {
            this.post(event)
        })
    }
}
