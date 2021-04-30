import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

import {
    saveAuthTicket,
    startContinuousRenew,
} from "../../../auth_ticket/start_continuous_renew/impl/core"
import { getScriptPath } from "../../../common/secure/get_script_path/impl/core"
import { authenticatePassword } from "../../authenticate/impl/core"

import { AuthenticatePasswordInfra } from "../../authenticate/infra"
import { StartContinuousRenewInfra } from "../../../auth_ticket/start_continuous_renew/infra"
import { GetScriptPathInfra } from "../../../common/secure/get_script_path/infra"

import {
    AuthenticatePasswordCoreMaterial,
    AuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreState,
    initialAuthenticatePasswordCoreState,
} from "./action"

import { GetScriptPathLocationDetecter } from "../../../common/secure/get_script_path/method"

import { LoadScriptError } from "../../../common/secure/get_script_path/data"
import { AuthenticatePasswordFields } from "../../authenticate/data"
import { AuthTicket } from "../../../auth_ticket/kernel/data"
import { ConvertBoardResult } from "../../../../z_vendor/getto-application/board/kernel/data"

export type AuthenticatePasswordCoreInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
    authenticate: AuthenticatePasswordInfra
}>

export function initAuthenticatePasswordCoreMaterial(
    infra: AuthenticatePasswordCoreInfra,
    locationInfo: GetScriptPathLocationDetecter,
): AuthenticatePasswordCoreMaterial {
    return {
        save: saveAuthTicket(infra.startContinuousRenew),
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(locationInfo),
        authenticate: authenticatePassword(infra.authenticate),
    }
}

export function initAuthenticatePasswordCoreAction(
    material: AuthenticatePasswordCoreMaterial,
): AuthenticatePasswordCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<AuthenticatePasswordCoreState>
    implements AuthenticatePasswordCoreAction {
    readonly initialState = initialAuthenticatePasswordCoreState

    material: AuthenticatePasswordCoreMaterial

    constructor(material: AuthenticatePasswordCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: ConvertBoardResult<AuthenticatePasswordFields>): void {
        this.material.authenticate(fields, (event) => {
            switch (event.type) {
                case "succeed-to-login":
                    this.startContinuousRenew(event.auth)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    startContinuousRenew(info: AuthTicket): void {
        this.material.save(info, (event) => {
            switch (event.type) {
                case "failed-to-save":
                    this.post({ type: "repository-error", continue: false, err: event.err })
                    return

                case "succeed-to-save":
                    this.material.startContinuousRenew((event) => {
                        switch (event.type) {
                            case "succeed-to-start-continuous-renew":
                                this.post({
                                    type: "try-to-load",
                                    scriptPath: this.secureScriptPath(),
                                })
                                return

                            default:
                                this.post(event)
                                return
                        }
                    })
                    return
            }
        })
    }

    loadError(err: LoadScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }
}
