import { ApplicationAbstractStateAction } from "../../../../../z_vendor/getto-application/action/impl"

import { getScriptPath } from "../../../common/secure/get_script_path/impl/core"
import { startContinuousRenew, saveAuthTicket } from "../../start_continuous_renew/impl/core"
import { renewAuthTicket, checkAuthTicket } from "../../check/impl/core"

import { GetScriptPathInfra } from "../../../common/secure/get_script_path/infra"
import { StartContinuousRenewInfra } from "../../start_continuous_renew/infra"
import { CheckAuthTicketInfra } from "../../check/infra"

import {
    CheckAuthTicketCoreAction,
    CheckAuthTicketCoreMaterial,
    CheckAuthTicketCoreState,
    initialCheckAuthTicketCoreState,
} from "./action"

import { GetScriptPathLocationDetecter } from "../../../common/secure/get_script_path/method"

import { AuthTicket } from "../../kernel/data"
import { LoadScriptError } from "../../../common/secure/get_script_path/data"

export type CheckAuthTicketCoreInfra = Readonly<{
    check: CheckAuthTicketInfra
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
}>

export function initCheckAuthTicketCoreMaterial(
    infra: CheckAuthTicketCoreInfra,
    locationInfo: GetScriptPathLocationDetecter,
): CheckAuthTicketCoreMaterial {
    return {
        renew: checkAuthTicket(infra.check),
        forceRenew: renewAuthTicket(infra.check),
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        save: saveAuthTicket(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}

export function initCheckAuthTicketCoreAction(
    material: CheckAuthTicketCoreMaterial,
): CheckAuthTicketCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<CheckAuthTicketCoreState>
    implements CheckAuthTicketCoreAction {
    readonly initialState = initialCheckAuthTicketCoreState

    material: CheckAuthTicketCoreMaterial

    constructor(material: CheckAuthTicketCoreMaterial) {
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

    startContinuousRenew(info: AuthTicket) {
        const result = this.material.save(info)
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
