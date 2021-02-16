import { ApplicationBaseAction } from "../../../../../common/vendor/getto-example/Application/impl"

import { getSecureScriptPath } from "../../../secureScriptPath/get/impl"
import { forceRenewAuthnInfo, renewAuthnInfo } from "../../../authnInfo/renew/impl"
import {
    forceStartContinuousRenewAuthnInfo,
    startContinuousRenewAuthnInfo,
} from "../../../authnInfo/startContinuousRenew/impl"

import { RenewAuthnInfoInfra } from "../../../authnInfo/renew/infra"
import { StartContinuousRenewAuthnInfoInfra } from "../../../authnInfo/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../secureScriptPath/get/infra"

import {
    RenewAuthnInfoMaterial,
    RenewAuthnInfoAction,
    RenewAuthnInfoActionState,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../secureScriptPath/get/method"

import { AuthnInfo } from "../../../authnInfo/common/data"
import { LoadSecureScriptError } from "../../../secureScriptPath/get/data"

export type RenewAuthnInfoActionInfra = Readonly<{
    renew: RenewAuthnInfoInfra
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>

export function initRenewAuthnInfoAction(
    infra: RenewAuthnInfoActionInfra,
    locationInfo: GetSecureScriptPathLocationInfo
): RenewAuthnInfoAction {
    return new Action({
        renew: renewAuthnInfo(infra.renew),
        forceRenew: forceRenewAuthnInfo(infra.renew),
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        forceStartContinuousRenew: forceStartContinuousRenewAuthnInfo(
            infra.startContinuousRenew
        ),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    })
}

class Action
    extends ApplicationBaseAction<RenewAuthnInfoActionState>
    implements RenewAuthnInfoAction {
    material: RenewAuthnInfoMaterial

    constructor(material: RenewAuthnInfoMaterial) {
        super()
        this.material = material
    }

    request(): void {
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
    }
    succeedToInstantLoad(): void {
        this.material.forceStartContinuousRenew((event) => {
            this.post(event)
        })
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
