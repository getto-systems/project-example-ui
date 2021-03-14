import { ApplicationAbstractStateAction } from "../../../../../../z_vendor/getto-application/action/impl"

import { resetPassword } from "../../reset/impl/core"
import { getScriptPath } from "../../../../common/secure/get_script_path/impl/core"
import {
    saveAuthTicket,
    startContinuousRenew,
} from "../../../../auth_ticket/start_continuous_renew/impl/core"

import { StartContinuousRenewInfra } from "../../../../auth_ticket/start_continuous_renew/infra"
import { GetScriptPathInfra } from "../../../../common/secure/get_script_path/infra"
import { ResetPasswordInfra } from "../../reset/infra"

import {
    ResetPasswordCoreMaterial,
    ResetPasswordCoreAction,
    ResetPasswordCoreState,
    ResetPasswordCoreForegroundMaterial,
    ResetPasswordCoreBackgroundMaterialPod,
    ResetPasswordCoreBackgroundMaterial,
    initialResetPasswordCoreState,
} from "./action"

import { GetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/method"
import { ResetPasswordLocationDetecter } from "../../reset/method"

import { LoadScriptError } from "../../../../common/secure/get_script_path/data"
import { ResetPasswordFields } from "../../reset/data"
import { AuthTicket } from "../../../../auth_ticket/kernel/data"
import { ConvertBoardResult } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export type ResetPasswordCoreInfra = ResetPasswordCoreForegroundInfra &
    ResetPasswordCoreBackgroundInfra

export type ResetPasswordCoreForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
}>
export type ResetPasswordCoreBackgroundInfra = Readonly<{
    reset: ResetPasswordInfra
}>

export type ResetPasswordCoreForegroundDetecter = Readonly<{
    getSecureScriptPath: GetScriptPathLocationDetecter
}>
export type ResetPasswordCoreBackgroundDetecter = Readonly<{
    reset: ResetPasswordLocationDetecter
}>

export function initResetPasswordCoreMaterial(
    infra: ResetPasswordCoreInfra,
    detecter: ResetPasswordCoreForegroundDetecter & ResetPasswordCoreBackgroundDetecter,
): ResetPasswordCoreMaterial {
    return {
        ...initResetPasswordCoreForegroundMaterial(infra, detecter),
        ...initResetPasswordCoreBackgroundMaterial(infra, detecter),
    }
}
export function initResetPasswordCoreForegroundMaterial(
    infra: ResetPasswordCoreForegroundInfra,
    detecter: ResetPasswordCoreForegroundDetecter,
): ResetPasswordCoreForegroundMaterial {
    return {
        save: saveAuthTicket(infra.startContinuousRenew),
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(detecter.getSecureScriptPath),
    }
}
export function initResetPasswordCoreBackgroundMaterial(
    infra: ResetPasswordCoreBackgroundInfra,
    detecter: ResetPasswordCoreBackgroundDetecter,
): ResetPasswordCoreBackgroundMaterial {
    const pod = initResetPasswordCoreBackgroundMaterialPod(infra)
    return {
        reset: pod.initReset(detecter.reset),
    }
}
export function initResetPasswordCoreBackgroundMaterialPod(
    infra: ResetPasswordCoreBackgroundInfra,
): ResetPasswordCoreBackgroundMaterialPod {
    return {
        initReset: resetPassword(infra.reset),
    }
}

export function initResetPasswordCoreAction(
    material: ResetPasswordCoreMaterial,
): ResetPasswordCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<ResetPasswordCoreState>
    implements ResetPasswordCoreAction {
    readonly initialState = initialResetPasswordCoreState

    material: ResetPasswordCoreMaterial

    constructor(material: ResetPasswordCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: ConvertBoardResult<ResetPasswordFields>): void {
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
    startContinuousRenew(info: AuthTicket): void {
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

    loadError(err: LoadScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }
}
