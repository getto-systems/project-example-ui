import { ApplicationAbstractStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import { startContinuousRenew } from "../../../../../kernel/authInfo/common/startContinuousRenew/impl"
import { getScriptPath } from "../../../../../common/secure/getScriptPath/impl/core"
import { authenticate } from "../../../impl"

import { AuthenticateInfra } from "../../../infra"
import { StartContinuousRenewInfra } from "../../../../../kernel/authInfo/common/startContinuousRenew/infra"
import { GetScriptPathInfra } from "../../../../../common/secure/getScriptPath/infra"

import {
    CoreMaterial,
    CoreAction,
    CoreState,
    CoreForegroundMaterial,
    CoreBackgroundMaterial,
} from "./action"

import { GetScriptPathLocationDetecter } from "../../../../../common/secure/getScriptPath/method"

import { LoadScriptError } from "../../../../../common/secure/getScriptPath/data"
import { AuthenticateFields } from "../../../data"
import { AuthInfo } from "../../../../../kernel/authInfo/kernel/data"
import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export type CoreInfra = CoreForegroundInfra & CoreBackgroundInfra

export type CoreForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
}>
export type CoreBackgroundInfra = Readonly<{
    authenticate: AuthenticateInfra
}>

export function initCoreMaterial(
    infra: CoreInfra,
    locationInfo: GetScriptPathLocationDetecter,
): CoreMaterial {
    return {
        ...initCoreForegroundMaterial(infra, locationInfo),
        ...initCoreBackgroundMaterial(infra),
    }
}
export function initCoreForegroundMaterial(
    infra: CoreForegroundInfra,
    locationInfo: GetScriptPathLocationDetecter,
): CoreForegroundMaterial {
    return {
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initCoreBackgroundMaterial(infra: CoreBackgroundInfra): CoreBackgroundMaterial {
    return {
        authenticate: authenticate(infra.authenticate),
    }
}

export function initCoreAction(material: CoreMaterial): CoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-login" }

    material: CoreMaterial

    constructor(material: CoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: ConvertBoardResult<AuthenticateFields>): void {
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
    startContinuousRenew(auth: AuthInfo): void {
        this.material.startContinuousRenew(auth, (event) => {
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
    }

    loadError(err: LoadScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }
}
