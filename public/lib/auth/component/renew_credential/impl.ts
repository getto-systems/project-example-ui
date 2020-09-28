import {
    RenewCredentialParam,
    RenewCredentialComponent,
    RenewCredentialResource,
    RenewCredentialState,
    RenewCredentialOperation,
    Done,
    done,
} from "../renew_credential/component"

import { CredentialAction } from "../../../credential/action"
import { ScriptAction } from "../../../script/action"

import { AuthResource, RenewEvent } from "../../../credential/data"
import { PagePathname } from "../../../script/data"

interface Action {
    credential: CredentialAction
    script: ScriptAction
}

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
    authResource: AuthResource
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
                    return this.paramIsNotSet()
                }

            default:
                return event
        }
    }

    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        this.listener.push(stateChanged)
    }

    init(): RenewCredentialResource {
        return {
            trigger: operation => this.trigger(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    trigger(operation: RenewCredentialOperation): Done {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackParam(operation.param) }
                return done

            case "renew":
                if (this.holder.set) {
                    this.action.credential.renew(this.holder.param.authResource)
                } else {
                    this.post(this.paramIsNotSet())
                }
                return done

            case "succeed-to-instant-load":
                if (this.holder.set) {
                    this.action.credential.setContinuousRenew(this.holder.param.authResource)
                } else {
                    this.post(this.paramIsNotSet())
                }
                return done

            case "failed-to-load":
                this.post({ type: "failed-to-load", err: operation.err })
                return done
        }
    }

    paramIsNotSet(): RenewCredentialState {
        return { type: "error", err: "param is not set: do `set-param` first" }
    }
}

type ParamHolder =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Param }>

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
