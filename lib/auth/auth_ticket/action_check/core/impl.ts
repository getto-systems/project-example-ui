import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

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
        super(async () =>
            this.material.renew((event) => {
                switch (event.type) {
                    case "try-to-instant-load":
                        return this.post({
                            type: "try-to-instant-load",
                            scriptPath: this.secureScriptPath(),
                        })

                    case "succeed-to-renew":
                        return this.startContinuousRenew(event.auth)

                    default:
                        return this.post(event)
                }
            }),
        )
        this.material = material
    }

    succeedToInstantLoad(): Promise<CheckAuthTicketCoreState> {
        return this.material.startContinuousRenew(this.post)
    }
    async failedToInstantLoad(): Promise<CheckAuthTicketCoreState> {
        return this.material.forceRenew((event) => {
            switch (event.type) {
                case "succeed-to-renew":
                    return this.startContinuousRenew(event.auth)

                default:
                    return this.post(event)
            }
        })
    }
    async loadError(err: LoadScriptError): Promise<CheckAuthTicketCoreState> {
        return this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }

    async startContinuousRenew(info: AuthTicket): Promise<CheckAuthTicketCoreState> {
        return this.material.save(info, (event) => {
            switch (event.type) {
                case "failed-to-save":
                    return this.post({ type: "repository-error", err: event.err })

                case "succeed-to-save":
                    return this.material.startContinuousRenew((event) => {
                        switch (event.type) {
                            case "succeed-to-start-continuous-renew":
                                return this.post({
                                    type: "try-to-load",
                                    scriptPath: this.secureScriptPath(),
                                })

                            default:
                                return this.post(event)
                        }
                    })
            }
        })
    }
}
