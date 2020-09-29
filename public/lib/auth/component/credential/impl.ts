import {
    CredentialParam,
    CredentialComponent,
    CredentialComponentResource,
    CredentialState,
    CredentialOperation,
} from "./component"

import { CredentialAction } from "../../../credential/action"
import { ApplicationAction } from "../../../application/action"

import { LastAuth, RenewEvent } from "../../../credential/data"
import { PagePathname } from "../../../application/data"

type Action = Readonly<{
    credential: CredentialAction
    application: ApplicationAction
}>

// Renew は unmount した後も interval を維持したいので worker にはしない
export function initCredentialComponent(action: Action): CredentialComponent {
    return new Component(action)
}

export function packCredentialParam(param: Param): CredentialParam {
    return param as Param & CredentialParam
}
function unpackParam(param: CredentialParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    pagePathname: PagePathname
    lastAuth: LastAuth
}>

class Component implements CredentialComponent {
    action: Action

    listener: Post<CredentialState>[] = []
    holder: ParamHolder = { set: false }

    constructor(action: Action) {
        this.action = action
        this.action.credential.sub.onRenewEvent((event) => {
            this.post(this.mapRenewEvent(event))
        })
    }
    post(state: CredentialState): void {
        this.listener.forEach(post => post(state))
    }
    mapRenewEvent(event: RenewEvent): CredentialState {
        switch (event.type) {
            case "try-to-instant-load":
            case "succeed-to-renew":
                if (this.holder.set) {
                    return {
                        type: event.type,
                        scriptPath: this.action.application.secureScriptPath(this.holder.param.pagePathname),
                    }
                } else {
                    return errorParamIsNotSet
                }

            default:
                return event
        }
    }

    onStateChange(stateChanged: Post<CredentialState>): void {
        this.listener.push(stateChanged)
    }

    init(): CredentialComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: CredentialOperation): void {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackParam(operation.param) }
                return

            case "renew":
                if (this.holder.set) {
                    this.action.credential.renew(this.holder.param.lastAuth)
                } else {
                    this.post(errorParamIsNotSet)
                }
                return

            case "succeed-to-instant-load":
                if (this.holder.set) {
                    this.action.credential.setContinuousRenew(this.holder.param.lastAuth)
                } else {
                    this.post(errorParamIsNotSet)
                }
                return

            case "failed-to-load":
                this.post({ type: "failed-to-load", err: operation.err })
                return

            default:
                assertNever(operation)
        }
    }
}

const errorParamIsNotSet: CredentialState = { type: "error", err: "param is not set: do `set-param` first" }

type ParamHolder =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Param }>

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
