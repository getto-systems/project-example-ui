import { RenewCredentialMaterial, RenewCredentialComponent, RenewCredentialState } from "./component"

import { LoadError } from "../../common/application/data"
import { AuthCredential, LastLogin, StorageError } from "../../common/credential/data"

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
                            // TODO load の前に setContinuousRenew しないといけない
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
        const result = this.material.loadLastLogin()
        if (!result.success) {
            this.post({ type: "storage-error", err: result.err })
            return
        }
        if (!result.found) {
            this.post({ type: "required-to-login" })
            return
        }
        hook(result.lastLogin)
    }
    removeAuthCredential(): void {
        const result = this.material.removeAuthCredential()
        if (!result.success) {
            this.storageError(result.err)
            return
        }
        this.post({ type: "required-to-login" })
    }
    storeAuthCredential(authCredential: AuthCredential, hook: { (): void }): void {
        const result = this.material.storeAuthCredential(authCredential)
        if (!result.success) {
            this.storageError(result.err)
            return
        }
        hook()
    }

    storageError(err: StorageError): void {
        this.post({ type: "storage-error", err })
    }
}

interface Post<T> {
    (state: T): void
}
