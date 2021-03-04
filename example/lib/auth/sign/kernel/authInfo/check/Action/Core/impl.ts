import { ApplicationAbstractStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import { getSecureScriptPath } from "../../../../../common/secureScriptPath/get/impl"
import {
    forceStartContinuousRenew,
    startContinuousRenew,
} from "../../../common/startContinuousRenew/impl"
import { renewAuthInfo, checkAuthInfo } from "../../impl"

import { GetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/infra"
import { StartContinuousRenewInfra } from "../../../common/startContinuousRenew/infra"
import { CheckAuthInfoInfra } from "../../infra"

import { CoreAction, CoreMaterial, CoreState } from "./action"

import { GetSecureScriptPathLocationDetecter } from "../../../../../common/secureScriptPath/get/method"

import { AuthInfo } from "../../../kernel/data"
import { LoadSecureScriptError } from "../../../../../common/secureScriptPath/get/data"

export type CoreInfra = Readonly<{
    renew: CheckAuthInfoInfra
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>

export function initCoreMaterial(
    infra: CoreInfra,
    locationInfo: GetSecureScriptPathLocationDetecter,
): CoreMaterial {
    return {
        renew: checkAuthInfo(infra.renew),
        forceRenew: renewAuthInfo(infra.renew),
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        forceStartContinuousRenew: forceStartContinuousRenew(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
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
        this.material.forceStartContinuousRenew(this.post)
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
    loadError(err: LoadSecureScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }

    startContinuousRenew(auth: AuthInfo) {
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
}
