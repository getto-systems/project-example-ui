import { newCoreForegroundMaterial } from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../../kernel/authInfo/common/startContinuousRenew/init"
import { newGetSecureScriptPathInfra } from "../../../../../../../common/secureScriptPath/get/main"

import { newResetLocationInfo } from "../../../../init"

import { toAction, toEntryPoint } from "../../impl"
import { CoreForegroundInfra, initCoreAction } from "../../Core/impl"
import { initFormAction } from "../../Form/impl"

import {
    WorkerAbstractProxy,
    WorkerProxy,
} from "../../../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    ResetPasswordProxyMaterial,
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "./message"

import { ResetPasswordEntryPoint } from "../../action"
import { CoreAction } from "../../Core/action"
import { FormAction } from "../../Form/action"

export interface ResetPasswordProxy
    extends WorkerProxy<ResetPasswordProxyMessage, ResetPasswordProxyResponse> {
    entryPoint(
        webStorage: Storage,
        currentURL: URL,
        currentLocation: Location,
    ): ResetPasswordEntryPoint
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

    entryPoint(
        webStorage: Storage,
        currentURL: URL,
        currentLocation: Location,
    ): ResetPasswordEntryPoint {
        const foreground = newCoreForegroundMaterial(webStorage, currentURL)
        const locationInfo = newResetLocationInfo(currentLocation)
        return newEntryPoint(
            initCoreAction({
                reset: (fields, post) =>
                    this.material.reset.call(
                        { fields, resetToken: locationInfo.getResetToken() },
                        post,
                    ),
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

export function newCoreForegroundInfra(webStorage: Storage): CoreForegroundInfra {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}

export function newEntryPoint(core: CoreAction): ResetPasswordEntryPoint {
    return toEntryPoint(toAction({ core, form: newFormAction() }))
}

function newFormAction(): FormAction {
    return initFormAction()
}

interface Post<M> {
    (message: M): void
}
