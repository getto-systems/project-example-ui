import { newCoreForegroundMaterial } from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/auth_info/common/start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../../../common/secure/get_script_path/impl/init"

import { newResetPasswordLocationDetecter } from "../../../reset/impl/init"

import { initResetPasswordEntryPoint } from "../../impl"
import { ResetPasswordCoreForegroundInfra, initResetPasswordCoreAction } from "../../core/impl"
import { initResetPasswordFormAction } from "../../form/impl"

import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    ResetPasswordProxyMaterial,
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "./message"

import { ResetPasswordEntryPoint } from "../../entry_point"
import { ResetPasswordCoreAction } from "../../core/action"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export interface ResetPasswordProxy
    extends WorkerProxy<ResetPasswordProxyMessage, ResetPasswordProxyResponse> {
    entryPoint(feature: OutsideFeature): ResetPasswordEntryPoint
}
export function newResetPasswordProxy(post: Post<ResetPasswordProxyMessage>): ResetPasswordProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<ResetPasswordProxyMessage, ResetPasswordProxyResponse>
    implements ResetPasswordProxy {
    material: ResetPasswordProxyMaterial

    constructor(post: Post<ResetPasswordProxyMessage>) {
        super(post)
        this.material = {
            reset: this.method("reset", (message) => message),
        }
    }

    entryPoint(feature: OutsideFeature): ResetPasswordEntryPoint {
        const { webStorage, currentLocation } = feature
        const foreground = newCoreForegroundMaterial(webStorage, currentLocation)
        const detecter = newResetPasswordLocationDetecter(currentLocation)
        return buildResetPasswordEntryPoint(
            initResetPasswordCoreAction({
                reset: (fields, post) =>
                    this.material.reset.call({ fields, resetToken: detecter() }, post),
                ...foreground,
            }),
        )
    }
    resolve(response: ResetPasswordProxyResponse): void {
        switch (response.method) {
            case "reset":
                this.material.reset.resolve(response)
                break
        }
    }
}

export function newResetPasswordCoreForegroundInfra(
    webStorage: Storage,
): ResetPasswordCoreForegroundInfra {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}

export function buildResetPasswordEntryPoint(
    core: ResetPasswordCoreAction,
): ResetPasswordEntryPoint {
    return initResetPasswordEntryPoint({ core, form: initResetPasswordFormAction() })
}

interface Post<M> {
    (message: M): void
}
