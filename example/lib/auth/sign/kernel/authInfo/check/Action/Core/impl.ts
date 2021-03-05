import { ApplicationAbstractStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import { getScriptPath } from "../../../../../common/secure/getScriptPath/impl/core"
import { startContinuousRenew, saveAuthInfo } from "../../../common/startContinuousRenew/impl/core"
import { renewAuthInfo, checkAuthInfo } from "../../impl"

import { GetScriptPathInfra } from "../../../../../common/secure/getScriptPath/infra"
import { StartContinuousRenewInfra } from "../../../common/startContinuousRenew/infra"
import { CheckAuthInfoInfra } from "../../infra"

import { CoreAction, CoreMaterial, CoreState } from "./action"

import { GetScriptPathLocationDetecter } from "../../../../../common/secure/getScriptPath/method"

import { AuthInfo } from "../../../kernel/data"
import { LoadScriptError } from "../../../../../common/secure/getScriptPath/data"

export type CoreInfra = Readonly<{
    renew: CheckAuthInfoInfra
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
}>

export function initCoreMaterial(
    infra: CoreInfra,
    locationInfo: GetScriptPathLocationDetecter,
): CoreMaterial {
    return {
        renew: checkAuthInfo(infra.renew),
        forceRenew: renewAuthInfo(infra.renew),
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        saveAuthInfo: saveAuthInfo(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}

export function initCoreAction(material: CoreMaterial): CoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<CoreState> implements CoreAction {
    readonly initialState: CoreState = { type: "initial-renew" }

    material: CoreMaterial

    constructor(material: CoreMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.renew((event) => {
                switch (event.type) {
                    case "try-to-instant-load":
                        this.post({
                            type: "try-to-instant-load",
                            scriptPath: this.secureScriptPath(),
                        })
                        return

                    case "succeed-to-renew":
                        this.startContinuousRenew(event.auth)
                        return

                    default:
                        this.post(event)
                        return
                }
            })
        })
    }

    succeedToInstantLoad(): void {
        this.material.startContinuousRenew(this.post)
    }
    failedToInstantLoad(): void {
        this.material.forceRenew((event) => {
            switch (event.type) {
                case "succeed-to-renew":
                    this.startContinuousRenew(event.auth)
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

    startContinuousRenew(info: AuthInfo) {
        const result = this.material.saveAuthInfo(info)
        if (!result.success) {
            this.post({ type: "repository-error", err: result.err })
        }

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
    }
}
