import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import { LoginLink } from "../link"

import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionMaterial,
    PasswordResetSessionComponent,
    PasswordResetSessionComponentState,
    PasswordResetSessionFormMaterial,
    PasswordResetSessionFormComponentFactory,
    PasswordResetSessionFormComponent,
} from "./component"

import { SessionID, StartSessionFields } from "../../profile/passwordReset/data"
import { FormConvertResult } from "../../../sub/getto-form/action/data"
import { FormBaseComponent } from "../../../sub/getto-form/component/impl"
import { LoginIDFormFieldComponent } from "../field/loginID/component"
import { initLoginIDFormFieldComponent } from "../field/loginID/impl"

export const initPasswordResetSessionComponent: PasswordResetSessionComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<PasswordResetSessionComponentState> implements PasswordResetSessionComponent {
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

export const initPasswordResetSessionFormComponent: PasswordResetSessionFormComponentFactory = (material) =>
    new FormComponent(material)

class FormComponent
    extends FormBaseComponent<PasswordResetSessionFormMaterial>
    implements PasswordResetSessionFormComponent {
    readonly loginID: LoginIDFormFieldComponent

    constructor(material: PasswordResetSessionFormMaterial) {
        super(material, {
            findFieldInput: (path) => {
                switch (path.field) {
                    case "loginID":
                        return { found: true, input: this.loginID.input }

                    default:
                        return { found: false }
                }
            },
        })

        this.loginID = this.initField(
            "loginID",
            initLoginIDFormFieldComponent({ loginID: material.loginID })
        )

        this.terminateHook(() => {
            this.loginID.terminate()
        })
    }

    getStartSessionFields(): FormConvertResult<StartSessionFields> {
        this.loginID.validate()

        const result = {
            loginID: this.material.loginID.convert(),
        }
        if (!result.loginID.success) {
            return { success: false }
        }
        return {
            success: true,
            value: {
                loginID: result.loginID.value,
            },
        }
    }
}
