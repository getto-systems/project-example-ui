import { ApplicationAbstractStateAction } from "../../../../../../../../z_vendor/getto-application/action/impl"

import { reset } from "../../../impl"
import { getScriptPath } from "../../../../../../common/secure/getScriptPath/impl/core"
import { startContinuousRenew } from "../../../../../../kernel/authInfo/common/startContinuousRenew/impl"

import { StartContinuousRenewInfra } from "../../../../../../kernel/authInfo/common/startContinuousRenew/infra"
import { GetScriptPathInfra } from "../../../../../../common/secure/getScriptPath/infra"
import { ResetInfra } from "../../../infra"

import {
    CoreMaterial,
    CoreAction,
    CoreState,
    CoreForegroundMaterial,
    CoreBackgroundMaterialPod,
    CoreBackgroundMaterial,
} from "./action"

import { GetScriptPathLocationDetecter } from "../../../../../../common/secure/getScriptPath/method"
import { ResetLocationDetecter } from "../../../method"

import { LoadScriptError } from "../../../../../../common/secure/getScriptPath/data"
import { ResetFields } from "../../../data"
import { AuthInfo } from "../../../../../../kernel/authInfo/kernel/data"
import { ConvertBoardResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"

export type CoreInfra = CoreForegroundInfra & CoreBackgroundInfra

export type CoreForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
}>
export type CoreBackgroundInfra = Readonly<{
    reset: ResetInfra
}>

export type CoreForegroundDetecter = Readonly<{
    getSecureScriptPath: GetScriptPathLocationDetecter
}>
export type CoreBackgroundDetecter = Readonly<{
    reset: ResetLocationDetecter
}>

export function initCoreMaterial(
    infra: CoreInfra,
    detecter: CoreForegroundDetecter & CoreBackgroundDetecter,
): CoreMaterial {
    return {
        ...initCoreForegroundMaterial(infra, detecter),
        ...initCoreBackgroundMaterial(infra, detecter),
    }
}
export function initCoreForegroundMaterial(
    infra: CoreForegroundInfra,
    detecter: CoreForegroundDetecter,
): CoreForegroundMaterial {
    return {
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(detecter.getSecureScriptPath),
    }
}
export function initCoreBackgroundMaterial(
    infra: CoreBackgroundInfra,
    detecter: CoreBackgroundDetecter,
): CoreBackgroundMaterial {
    const pod = initCoreBackgroundMaterialPod(infra)
    return {
        reset: pod.initReset(detecter.reset),
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
    readonly initialState: CoreState = { type: "initial-reset" }

    material: CoreMaterial

    constructor(material: CoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: ConvertBoardResult<ResetFields>): void {
        this.material.reset(fields, (event) => {
            switch (event.type) {
                case "succeed-to-reset":
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
