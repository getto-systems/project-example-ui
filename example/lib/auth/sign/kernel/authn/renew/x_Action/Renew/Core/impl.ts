import { ApplicationAbstractStateAction } from "../../../../../../../../z_vendor/getto-application/action/impl"

import { getSecureScriptPath } from "../../../../../../common/secureScriptPath/get/impl"
import {
    forceStartContinuousRenew,
    startContinuousRenew,
} from "../../../../common/startContinuousRenew/impl"
import { forceRenew, renew } from "../../../impl"

import { GetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/infra"
import { StartContinuousRenewInfra } from "../../../../common/startContinuousRenew/infra"
import { RenewInfra } from "../../../infra"

import { CoreAction, CoreMaterial, CoreState } from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/method"

import { Authn } from "../../../../kernel/data"
import { LoadSecureScriptError } from "../../../../../../common/secureScriptPath/get/data"

export type CoreInfra = Readonly<{
    renew: RenewInfra
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>

export function initCoreMaterial(
    infra: CoreInfra,
    locationInfo: GetSecureScriptPathLocationInfo,
): CoreMaterial {
    return {
        renew: renew(infra.renew),
        forceRenew: forceRenew(infra.renew),
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
                        this.startContinuousRenew(event.authnInfo)
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
                    this.startContinuousRenew(event.authnInfo)
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

    startContinuousRenew(authCredential: Authn) {
        this.material.startContinuousRenew(authCredential, (event) => {
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
