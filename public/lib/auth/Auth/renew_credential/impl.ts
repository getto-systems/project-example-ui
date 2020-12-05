import { RenewCredentialMaterial, RenewCredentialComponent, RenewCredentialState } from "./component"

import { RenewEvent, SetContinuousRenewEvent } from "../../login/renew/data"
import { LoadError } from "../../common/application/data"

export function initRenewCredential(material: RenewCredentialMaterial): RenewCredentialComponent {
    return new Component(material)
}

class Component implements RenewCredentialComponent {
    material: RenewCredentialMaterial

    listener: Post<RenewCredentialState>[] = []

    constructor(material: RenewCredentialMaterial) {
        this.material = material
    }

    onStateChange(post: Post<RenewCredentialState>): void {
        this.listener.push(post)
    }
    post(state: RenewCredentialState): void {
        this.listener.forEach((post) => post(state))
    }

    renew(): void {
        this.material.renew((event) => {
            this.post(this.mapRenewEvent(event))
        })
    }
    succeedToInstantLoad(): void {
        this.material.setContinuousRenew((event) => {
            this.post(this.mapSetContinuousRenewEvent(event))
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    mapRenewEvent(event: RenewEvent): RenewCredentialState {
        switch (event.type) {
            case "try-to-instant-load":
            case "succeed-to-renew":
                return {
                    type: event.type,
                    scriptPath: this.material.secureScriptPath(),
                }

            default:
                return event
        }
    }
    mapSetContinuousRenewEvent(event: SetContinuousRenewEvent): RenewCredentialState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
