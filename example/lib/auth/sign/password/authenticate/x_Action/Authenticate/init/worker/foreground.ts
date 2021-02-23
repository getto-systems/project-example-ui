import {
    newForegroundMaterial,
    toAuthenticatePasswordAction,
    toAuthenticatePasswordEntryPoint,
} from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/main"
import { newGetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/main"

import {
    AuthenticatePasswordCoreForegroundBase,
    initAuthenticatePasswordCoreAction,
} from "../../Core/impl"
import { initAuthenticatePasswordFormAction } from "../../Form/impl"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../../../z_getto/application/worker/foreground"

import {
    AuthenticatePasswordProxyMaterial,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "./message"

import { AuthenticatePasswordEntryPoint } from "../../action"
import { AuthenticatePasswordCoreAction } from "../../Core/action"
import { AuthenticatePasswordFormAction } from "../../Form/action"

export interface AuthenticatePasswordProxy
    extends WorkerProxy<AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse> {
    entryPoint(webStorage: Storage, currentURL: URL): AuthenticatePasswordEntryPoint
}
export function newAuthenticatePasswordProxy(
    post: Post<AuthenticatePasswordProxyMessage>,
): AuthenticatePasswordProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<AuthenticatePasswordProxyMessage>
    implements AuthenticatePasswordProxy {
    material: AuthenticatePasswordProxyMaterial

    constructor(post: Post<AuthenticatePasswordProxyMessage>) {
        super(post)
        this.material = {
            authenticate: this.method("authenticate", (message) => message),
        }
    }

    entryPoint(webStorage: Storage, currentURL: URL): AuthenticatePasswordEntryPoint {
        const foreground = newForegroundMaterial(webStorage, currentURL)
        return newEntryPoint(
            initAuthenticatePasswordCoreAction({
                authenticate: (fields, post) => this.material.authenticate.call({ fields }, post),
                ...foreground.core,
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

export function newForegroundBase(webStorage: Storage): AuthenticatePasswordCoreForegroundBase {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}

export function newEntryPoint(
    core: AuthenticatePasswordCoreAction,
): AuthenticatePasswordEntryPoint {
    return toAuthenticatePasswordEntryPoint(
        toAuthenticatePasswordAction({ core, form: newFormAction() }),
    )
}

function newFormAction(): AuthenticatePasswordFormAction {
    return initAuthenticatePasswordFormAction()
}

interface Post<M> {
    (message: M): void
}
