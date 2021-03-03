import { ApplicationAbstractStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import { startContinuousRenew } from "../../../../../kernel/authInfo/common/startContinuousRenew/impl"
import { getSecureScriptPath } from "../../../../../common/secureScriptPath/get/impl"
import { authenticate } from "../../../impl"

import { AuthenticateInfra } from "../../../infra"
import { StartContinuousRenewInfra } from "../../../../../kernel/authInfo/common/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/infra"

import {
    CoreMaterial,
    CoreAction,
    CoreState,
    CoreForegroundMaterial,
    CoreBackgroundMaterial,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/method"

import { LoadSecureScriptError } from "../../../../../common/secureScriptPath/get/data"
import { AuthenticateFields } from "../../../data"
import { AuthInfo } from "../../../../../kernel/authInfo/kernel/data"
import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export type CoreInfra = CoreForegroundInfra & CoreBackgroundInfra

export type CoreForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type CoreBackgroundInfra = Readonly<{
    authenticate: AuthenticateInfra
}>

export function initCoreMaterial(
    infra: CoreInfra,
    locationInfo: GetSecureScriptPathLocationInfo,
): CoreMaterial {
    return {
        ...initCoreForegroundMaterial(infra, locationInfo),
        ...initCoreBackgroundMaterial(infra),
    }
}
export function initCoreForegroundMaterial(
    infra: CoreForegroundInfra,
    locationInfo: GetSecureScriptPathLocationInfo,
): CoreForegroundMaterial {
    return {
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
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

    loadError(err: LoadSecureScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }
}
