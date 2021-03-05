import { ApplicationAbstractStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import { getScriptPath } from "../../../../../common/secure/getScriptPath/impl/core"
import { startContinuousRenew, saveAuthInfo } from "../../../common/startContinuousRenew/impl/core"
import { renewAuthInfo, checkAuthInfo } from "../../impl/core"

import { GetScriptPathInfra } from "../../../../../common/secure/getScriptPath/infra"
import { StartContinuousRenewInfra } from "../../../common/startContinuousRenew/infra"
import { CheckAuthInfoInfra } from "../../infra"

import {
    CheckAuthInfoCoreAction,
    CheckAuthInfoCoreMaterial,
    CheckAuthInfoCoreState,
    initialCheckAuthInfoCoreState,
} from "./action"

import { GetScriptPathLocationDetecter } from "../../../../../common/secure/getScriptPath/method"

import { AuthInfo } from "../../../kernel/data"
import { LoadScriptError } from "../../../../../common/secure/getScriptPath/data"

export type CheckAuthInfoCoreInfra = Readonly<{
    check: CheckAuthInfoInfra
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
}>

export function initCheckAuthInfoCoreMaterial(
    infra: CheckAuthInfoCoreInfra,
    locationInfo: GetScriptPathLocationDetecter,
): CheckAuthInfoCoreMaterial {
    return {
        renew: checkAuthInfo(infra.check),
        forceRenew: renewAuthInfo(infra.check),
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        saveAuthInfo: saveAuthInfo(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}

export function initCheckAuthInfoCoreAction(
    material: CheckAuthInfoCoreMaterial,
): CheckAuthInfoCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<CheckAuthInfoCoreState>
    implements CheckAuthInfoCoreAction {
    readonly initialState = initialCheckAuthInfoCoreState

    material: CheckAuthInfoCoreMaterial

    constructor(material: CheckAuthInfoCoreMaterial) {
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
