import { ApplicationAbstractStateAction } from "../../../../../../../../z_getto/application/impl"

import { reset } from "../../../impl"
import { getSecureScriptPath } from "../../../../../../common/secureScriptPath/get/impl"
import { startContinuousRenew } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/impl"

import { StartContinuousRenewInfra } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/infra"
import { ResetInfra } from "../../../infra"

import {
    CoreMaterial,
    CoreAction,
    CoreState,
    CoreForegroundMaterial,
    CoreBackgroundMaterialPod,
    CoreBackgroundMaterial,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/method"
import { ResetLocationInfo } from "../../../method"

import { LoadSecureScriptError } from "../../../../../../common/secureScriptPath/get/data"
import { ResetFields } from "../../../data"
import { AuthnInfo } from "../../../../../../kernel/authnInfo/kernel/data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export type CoreInfra = CoreForegroundInfra & CoreBackgroundInfra

export type CoreForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type CoreBackgroundInfra = Readonly<{
    reset: ResetInfra
}>

export function initCoreMaterial(
    infra: CoreInfra,
    locationInfo: GetSecureScriptPathLocationInfo & ResetLocationInfo,
): CoreMaterial {
    return {
        ...initCoreForegroundMaterial(infra, locationInfo),
        ...initCoreBackgroundMaterial(infra, locationInfo),
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
export function initCoreBackgroundMaterial(
    infra: CoreBackgroundInfra,
    locationInfo: ResetLocationInfo,
): CoreBackgroundMaterial {
    const pod = initCoreBackgroundMaterialPod(infra)
    return {
        reset: pod.initReset(locationInfo),
    }
}
export function initCoreBackgroundMaterialPod(
    infra: CoreBackgroundInfra,
): CoreBackgroundMaterialPod {
    return {
        initReset: reset(infra.reset),
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

    submit(fields: BoardConvertResult<ResetFields>): void {
        this.material.reset(fields, (event) => {
            switch (event.type) {
                case "succeed-to-reset":
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
