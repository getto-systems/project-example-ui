import { ApplicationAbstractStateAction } from "../../../../../../../z_getto/application/impl"

import { startContinuousRenewAuthnInfo } from "../../../../../kernel/authnInfo/common/startContinuousRenew/impl"
import { getSecureScriptPath } from "../../../../../common/secureScriptPath/get/impl"
import { authenticate } from "../../../impl"

import { AuthenticateInfra } from "../../../infra"
import { StartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/common/startContinuousRenew/infra"
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
import { AuthnInfo } from "../../../../../kernel/authnInfo/kernel/data"
import { BoardConvertResult } from "../../../../../../../z_getto/board/kernel/data"

export type CoreInfra = CoreForegroundInfra & CoreBackgroundInfra

export type CoreForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
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
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
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
    material: CoreMaterial

    constructor(material: CoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: BoardConvertResult<AuthenticateFields>): void {
        this.material.authenticate(fields, (event) => {
            switch (event.type) {
                case "succeed-to-login":
                    this.startContinuousRenew(event.authnInfo)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    startContinuousRenew(authnInfo: AuthnInfo): void {
        this.material.startContinuousRenew(authnInfo, (event) => {
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
