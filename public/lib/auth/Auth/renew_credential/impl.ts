import { RenewCredentialMaterial, RenewCredentialComponent, RenewCredentialState } from "./component"

import { RemoveEvent } from "../../login/renew/data"
import { LoadError } from "../../common/application/data"
import { AuthCredential, LastLogin } from "../../common/credential/data"

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
        this.findLastLogin((lastLogin) => {
            this.material.renew(lastLogin, (event) => {
                switch (event.type) {
                    case "try-to-instant-load":
                        this.tryToLoad(event)
                        return

                    case "unauthorized":
                        this.removeAuthCredential()
                        return

                    case "succeed-to-renew":
                        this.storeAuthCredential(event.authCredential, () => {
                            this.tryToLoad(event)
                        })
                        return

                    default:
                        this.post(event)
                        return
                }
            })
        })
    }
    succeedToInstantLoad(): void {
        this.findLastLogin((lastLogin) => {
            this.material.setContinuousRenew(lastLogin, (event) => {
                switch (event.type) {
                    case "unauthorized":
                        this.removeAuthCredential()
                        return

                    case "succeed-to-renew":
                        this.storeAuthCredential(event.authCredential, () => {
                            // 継続更新が成功してもコンポーネントの状態は変えない
                        })
                        return

                    default:
                        this.post(event)
                        return
                }
            })
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    tryToLoad(event: { type: "try-to-instant-load" | "succeed-to-renew" }): void {
        this.post({
            type: event.type,
            scriptPath: this.material.secureScriptPath(),
        })
    }

    findLastLogin(hook: { (lastLogin: LastLogin): void }): void {
        this.material.find((event) => {
            switch (event.type) {
                case "not-found":
                    this.post({ type: "required-to-login" })
                    return

                case "succeed-to-find":
                    hook(event.lastLogin)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    removeAuthCredential(): void {
        this.material.remove((event) => {
            this.post(map(event))
        })

        function map(event: RemoveEvent): RenewCredentialState {
            switch (event.type) {
                case "succeed-to-remove":
                    return { type: "required-to-login" }
                default:
                    return event
            }
        }
    }
    storeAuthCredential(authCredential: AuthCredential, hook: { (): void }): void {
        this.material.store(authCredential, (event) => {
            switch (event.type) {
                case "succeed-to-store":
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
