import { ApplicationBaseComponent } from "../../../../../sub/getto-example/x_components/Application/impl"

import {
    RenewCredentialComponentFactory,
    RenewCredentialMaterial,
    RenewCredentialComponent,
    RenewCredentialComponentState,
} from "../component"

import { LoadError } from "../../../../common/application/data"
import { emptyAuthCredential, storeAuthCredential, StoreAuthCredential } from "../../../../login/credentialStore/data"

export const initRenewCredentialComponent: RenewCredentialComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<RenewCredentialComponentState> implements RenewCredentialComponent {
    material: RenewCredentialMaterial

    constructor(material: RenewCredentialMaterial) {
        super()
        this.material = material
    }

    request(): void {
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
