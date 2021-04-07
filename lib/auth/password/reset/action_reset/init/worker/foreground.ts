import { newCoreForegroundMaterial } from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../auth_ticket/start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../../../common/secure/get_script_path/impl/init"

import { newResetPasswordLocationDetecter } from "../../../reset/impl/init"

import { initResetPasswordView } from "../../impl"
import { ResetPasswordCoreForegroundInfra, initResetPasswordCoreAction } from "../../core/impl"
import { initResetPasswordFormAction } from "../../form/impl"

import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    ResetPasswordProxyMaterial,
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "./message"

import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/repository/infra"

import { ResetPasswordView } from "../../resource"
import { ResetPasswordCoreAction } from "../../core/action"
import { LocationOutsideFeature } from "../../../../../../z_vendor/getto-application/location/infra"

type OutsideFeature = RemoteOutsideFeature & RepositoryOutsideFeature & LocationOutsideFeature
export interface ResetPasswordProxy
    extends WorkerProxy<ResetPasswordProxyMessage, ResetPasswordProxyResponse> {
    view(feature: OutsideFeature): ResetPasswordView
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

    view(feature: OutsideFeature): ResetPasswordView {
        const foreground = newCoreForegroundMaterial(feature)
        const detecter = newResetPasswordLocationDetecter(feature)
        return buildResetPasswordView(
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
    feature: OutsideFeature,
): ResetPasswordCoreForegroundInfra {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(feature),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}

export function buildResetPasswordView(core: ResetPasswordCoreAction): ResetPasswordView {
    return initResetPasswordView({ core, form: initResetPasswordFormAction() })
}

interface Post<M> {
    (message: M): void
}
