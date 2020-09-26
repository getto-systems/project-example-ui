import { TopLink } from "../../link"
import { AuthUsecase, AuthComponent, AuthState } from "../usecase"
import { Infra } from "../infra"

import { AuthCredential } from "../../credential/data"

export function initAuthUsecase(link: TopLink, component: AuthComponent, infra: Infra): AuthUsecase {
    return new Usecase(link, component, infra)
}

class Usecase implements AuthUsecase {
    link: TopLink
    component: AuthComponent

    infra: Infra
    listener: Post<AuthState>[]

    constructor(link: TopLink, component: AuthComponent, infra: Infra) {
        this.link = link
        this.component = component

        this.infra = infra
        this.listener = []

        this.component.renewCredential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.tryToLogin()
                    return

                case "succeed-to-renew":
                    this.loadApplication(state.authCredential)
                    return

                case "succeed-to-renew-interval":
                    this.storeCredential(state.authCredential)
                    return
            }
        })

        this.component.passwordLogin.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-login":
                    this.loadApplication(state.authCredential)
                    return
            }
        })

        this.component.passwordReset.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-reset":
                    this.loadApplication(state.authCredential)
                    return
            }
        })
    }

    onStateChange(stateChanged: Post<AuthState>): void {
        this.listener.push(stateChanged)
    }

    init(): Terminate {
        this.initUsecase()
        return () => this.terminate()
    }
    initUsecase(): void {
        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            this.post({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            this.tryToLogin()
            return
        }

        this.post({ type: "renew-credential", param: this.infra.param.renewCredential(found.content) })
    }
    terminate(): void {
        // component とインターフェイスを合わせるために必要
    }

    post(state: AuthState): void {
        this.listener.forEach(post => post(state))
    }

    tryToLogin(): void {
        this.post(this.infra.authLocation.detect(this.infra.param))
    }
    loadApplication(authCredential: AuthCredential): void {
        // 例外的に直接 trigger する : この直後に unmount するので画面へのフィードバックがないため
        this.component.renewCredential.trigger({ type: "set-renew-interval", ticketNonce: authCredential.ticketNonce })

        this.storeCredential(authCredential)
        this.post({
            type: "load-application",
            param: this.infra.param.loadApplication(this.infra.authLocation.currentPagePathname()),
        })
    }
    storeCredential(authCredential: AuthCredential): void {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            this.post({ type: "failed-to-store", err: response.err })
            return
        }
    }
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
