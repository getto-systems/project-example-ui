import {
    RenewCredentialParam,
    RenewCredentialComponent,
    RenewCredentialComponentResource,
    RenewCredentialState,
    RenewCredentialOperation,
} from "../renew_credential/component"

import { CredentialAction } from "../../../credential/action"
import { ScriptAction } from "../../../script/action"

import { LastAuth, RenewEvent } from "../../../credential/data"
import { PagePathname } from "../../../script/data"

type Action = Readonly<{
    credential: CredentialAction
    script: ScriptAction
}>

// Renew は unmount した後も interval を維持したいので worker にはしない
export function initRenewCredentialComponent(action: Action): RenewCredentialComponent {
    return new Component(action)
}

export function packRenewCredentialParam(param: Param): RenewCredentialParam {
    return param as Param & RenewCredentialParam
}
function unpackParam(param: RenewCredentialParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    pagePathname: PagePathname
    lastAuth: LastAuth
}>

class Component implements RenewCredentialComponent {
    action: Action

    listener: Post<RenewCredentialState>[] = []
    holder: ParamHolder = { set: false }

    constructor(action: Action) {
        this.action = action
        this.action.credential.sub.onRenewEvent((event) => {
            this.post(this.mapRenewEvent(event))
        })
    }
    post(state: RenewCredentialState): void {
        this.listener.forEach(post => post(state))
    }
    mapRenewEvent(event: RenewEvent): RenewCredentialState {
        switch (event.type) {
            case "try-to-instant-load":
            case "succeed-to-renew":
                if (this.holder.set) {
                    return {
                        type: event.type,
                        scriptPath: this.action.script.secureScriptPath(this.holder.param.pagePathname),
                    }
                } else {
                    return errorParamIsNotSet
                }

            default:
                return event
        }
    }

    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        this.listener.push(stateChanged)
    }

    init(): RenewCredentialComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: RenewCredentialOperation): void {
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

const errorParamIsNotSet: RenewCredentialState = { type: "error", err: "param is not set: do `set-param` first" }

type ParamHolder =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Param }>

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
