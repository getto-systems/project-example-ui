import { newCoreForegroundMaterial } from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authInfo/common/startContinuousRenew/init"
import { newGetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/main"

import { toAction, toEntryPoint } from "../../impl"

import { CoreForegroundInfra, initCoreAction } from "../../Core/impl"
import { initFormAction } from "../../Form/impl"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    AuthenticatePasswordProxyMaterial,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "./message"

import { AuthenticatePasswordEntryPoint } from "../../action"
import { CoreAction } from "../../Core/action"
import { FormAction } from "../../Form/action"

export interface AuthenticatePasswordProxy
    extends WorkerProxy<AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse> {
    entryPoint(webStorage: Storage, currentLocation: Location): AuthenticatePasswordEntryPoint
}
export function newAuthenticatePasswordProxy(
    post: Post<AuthenticatePasswordProxyMessage>,
): AuthenticatePasswordProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse>
    implements AuthenticatePasswordProxy {
    material: AuthenticatePasswordProxyMaterial

    constructor(post: Post<AuthenticatePasswordProxyMessage>) {
        super(post)
        this.material = {
            authenticate: this.method("authenticate", (message) => message),
        }
    }

    entryPoint(webStorage: Storage, currentLocation: Location): AuthenticatePasswordEntryPoint {
        const foreground = newCoreForegroundMaterial(webStorage, currentLocation)
        return newEntryPoint(
            initCoreAction({
                authenticate: (fields, post) => this.material.authenticate.call({ fields }, post),
                ...foreground,
            }),
        )
    }
    resolve(response: AuthenticatePasswordProxyResponse): void {
        switch (response.method) {
            case "authenticate":
                this.material.authenticate.resolve(response)
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

export function newEntryPoint(core: CoreAction): AuthenticatePasswordEntryPoint {
    return toEntryPoint(toAction({ core, form: newFormAction() }))
}

function newFormAction(): FormAction {
    return initFormAction()
}

interface Post<M> {
    (message: M): void
}
