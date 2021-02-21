import { ApplicationAbstractAction } from "../../../../../../../z_getto/application/impl"

import { getSecureScriptPath } from "../../../../../common/secureScriptPath/get/impl"
import { forceRenewAuthnInfo, renewAuthnInfo } from "../../impl"
import {
    forceStartContinuousRenewAuthnInfo,
    startContinuousRenewAuthnInfo,
} from "../../../common/startContinuousRenew/impl"

import { RenewAuthnInfoInfra } from "../../infra"
import { StartContinuousRenewAuthnInfoInfra } from "../../../common/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/infra"

import {
    RenewAuthnInfoMaterial,
    RenewAuthnInfoAction,
    RenewAuthnInfoState,
    RenewAuthnInfoEntryPoint,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/method"

import { AuthnInfo } from "../../../kernel/data"
import { LoadSecureScriptError } from "../../../../../common/secureScriptPath/get/data"

export function toRenewAuthnInfoEntryPoint(action: RenewAuthnInfoAction): RenewAuthnInfoEntryPoint {
    return {
        resource: { renew: action },
        terminate: () => {
            action.terminate()
        },
    }
}

export type RenewAuthnInfoBase = Readonly<{
    renew: RenewAuthnInfoInfra
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>

export function initRenewAuthnInfoAction(
    infra: RenewAuthnInfoBase,
    locationInfo: GetSecureScriptPathLocationInfo
): RenewAuthnInfoAction {
    return new Action({
        renew: renewAuthnInfo(infra.renew),
        forceRenew: forceRenewAuthnInfo(infra.renew),
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        forceStartContinuousRenew: forceStartContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    })
}

class Action
    extends ApplicationAbstractAction<RenewAuthnInfoState>
    implements RenewAuthnInfoAction {
    material: RenewAuthnInfoMaterial

    constructor(material: RenewAuthnInfoMaterial) {
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

    startContinuousRenew(authCredential: AuthnInfo) {
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
