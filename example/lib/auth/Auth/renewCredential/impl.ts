import {
    RenewCredentialComponentFactory,
    RenewCredentialMaterial,
    RenewCredentialComponent,
    RenewCredentialState,
} from "./component"

import { LoadError } from "../../common/application/data"
import { emptyAuthCredential, storeAuthCredential, StoreAuthCredential } from "../../login/renew/data"

export const initRenewCredentialComponent: RenewCredentialComponentFactory = (material) =>
    new Component(material)

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
            switch (event.type) {
                case "try-to-instant-load":
                    this.post({ type: "try-to-instant-load", scriptPath: this.secureScriptPath() })
                    return

                case "succeed-to-renew":
                    this.setContinuousRenew(storeAuthCredential(event.authCredential), () => {
                        this.post({ type: "try-to-load", scriptPath: this.secureScriptPath() })
                    })
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    succeedToInstantLoad(): void {
        this.setContinuousRenew(emptyAuthCredential, () => {
            this.post({ type: "succeed-to-set-continuous-renew" })
        })
    }
    failedToInstantLoad(): void {
        this.material.forceRenew((event) => {
            switch (event.type) {
                case "succeed-to-renew":
                    this.setContinuousRenew(storeAuthCredential(event.authCredential), () => {
                        this.post({ type: "try-to-load", scriptPath: this.secureScriptPath() })
                    })
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.secureScriptPath()
    }
    setContinuousRenew(authCredential: StoreAuthCredential, hook: { (): void }) {
        this.material.setContinuousRenew(authCredential, (event) => {
            switch (event.type) {
                case "succeed-to-set-continuous-renew":
                    hook()
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
}

interface Post<T> {
    (state: T): void
}
