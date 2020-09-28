import { AppHref } from "../../href"
import { AuthUsecase, AuthComponent, AuthState } from "../usecase"

import { StoreCredentialComponent } from "../../background/store_credential/component"

import { Infra } from "../infra"

export function initAuthUsecase(href: AppHref, component: AuthComponent, background: Background, infra: Infra): AuthUsecase {
    return new Usecase(href, component, background, infra)
}

type Background = Readonly<{
    storeCredential: StoreCredentialComponent
}>

class Usecase implements AuthUsecase {
    href: AppHref
    component: AuthComponent
    background: Background

    infra: Infra
    listener: Post<AuthState>[] = []

    loaded = false

    constructor(href: AppHref, component: AuthComponent, background: Background, infra: Infra) {
        this.href = href
        this.component = component
        this.background = background
        this.infra = infra

        this.component.renewCredential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.infra.authLocation.detect(this.infra.param))
                    return
            }
        })

        this.component.passwordLogin.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-login":
                    this.post({
                        type: "load-application",
                        param: this.infra.param.loadApplication({
                            pagePathname: this.infra.authLocation.currentPagePathname(),
                        }),
                    })
                    return
            }
        })

        this.component.passwordReset.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-reset":
                    this.post({
                        type: "load-application",
                        param: this.infra.param.loadApplication({
                            pagePathname: this.infra.authLocation.currentPagePathname(),
                        }),
                    })
                    return
            }
        })

        this.background.storeCredential.sub.onStoreEvent((event) => {
            switch (event.type) {
                case "failed-to-store":
                    this.post({ type: "error", err: event.err.err })
                    return
            }
        })
    }

    onStateChange(stateChanged: Post<AuthState>): void {
        this.listener.push(stateChanged)
    }

    post(state: AuthState): void {
        this.listener.forEach(post => post(state))
    }

    init(): Terminate {
        this.initUsecase()
        return () => { /* component とインターフェイスを合わせるために必要 */ }
    }
    initUsecase(): void {
        const fetchResponse = this.background.storeCredential.fetch()
        if (!fetchResponse.success) {
            this.post({ type: "error", err: fetchResponse.err.err })
            return
        }
        if (!fetchResponse.found) {
            this.post(this.infra.authLocation.detect(this.infra.param))
            return
        }

        this.post({
            type: "renew-credential",
            param: this.infra.param.renewCredential({
                pagePathname: this.infra.authLocation.currentPagePathname(),
                authResource: fetchResponse.content
            }),
        })
    }
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>

type DelayTime = Readonly<{ delay_milli_second: number }>
