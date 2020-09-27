import { AppHref } from "../../href"
import { AuthUsecase, AuthComponent, AuthState } from "../usecase"
import { Infra } from "../infra"

import { AuthCredential } from "../../credential/data"

export function initAuthUsecase(href: AppHref, component: AuthComponent, infra: Infra): AuthUsecase {
    return new Usecase(href, component, infra)
}

class Usecase implements AuthUsecase {
    href: AppHref
    component: AuthComponent

    infra: Infra
    listener: Post<AuthState>[]

    constructor(href: AppHref, component: AuthComponent, infra: Infra) {
        this.href = href
        this.component = component

        this.infra = infra
        this.listener = []

        this.component.loadApplication.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-load":
                    if (state.instantly) {
                        this.tryToRenew()
                    }
                    return
            }
        })

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
        const ticketNonce = this.infra.authCredentials.findTicketNonce()
        if (!ticketNonce.success) {
            this.post({ type: "failed-to-fetch", err: ticketNonce.err })
            return
        }
        if (!ticketNonce.found) {
            this.tryToLogin()
            return
        }

        const lastAuthAt = this.infra.authCredentials.findLastAuthAt()
        if (!lastAuthAt.success) {
            this.post({ type: "failed-to-fetch", err: lastAuthAt.err })
            return
        }

        if (this.infra.expires.hasExceeded(lastAuthAt, this.infra.timeConfig.instantLoadExpireTime)) {
            this.post({ type: "renew-credential", param: this.infra.param.renewCredential(ticketNonce.content) })
        } else {
            this.post({
                type: "load-application",
                param: this.infra.param.loadApplication({
                    pagePathname: this.infra.authLocation.currentPagePathname(),
                    instantly: true,
                }),
            })
        }
    }
    terminate(): void {
        // component とインターフェイスを合わせるために必要
    }

    post(state: AuthState): void {
        this.listener.forEach(post => post(state))
    }

    tryToRenew(): void {
        // 画面へフィードバックできないため、失敗イベントは発行しない
        const ticketNonce = this.infra.authCredentials.findTicketNonce()
        if (!ticketNonce.success) {
            return
        }
        if (!ticketNonce.found) {
            return
        }

        const lastAuthAt = this.infra.authCredentials.findLastAuthAt()
        if (!lastAuthAt.success) {
            return
        }

        // 例外的に直接 trigger する : 画面へフィードバックできないため
        this.component.renewCredential.trigger({
            type: "set-renew-interval",
            ticketNonce: ticketNonce.content,
            run: { immediately: true, delay: this.infra.runner.nextRun(lastAuthAt, this.infra.timeConfig.renewRunDelayTime) },
        })
    }
    tryToLogin(): void {
        this.post(this.infra.authLocation.detect(this.infra.param))
    }
    loadApplication(authCredential: AuthCredential): void {
        this.storeCredential(authCredential)

        // 例外的に直接 trigger する : 画面へフィードバックできないため
        this.component.renewCredential.trigger({
            type: "set-renew-interval",
            ticketNonce: authCredential.ticketNonce,
            run: { immediately: false },
        })

        this.post({
            type: "load-application",
            param: this.infra.param.loadApplication({
                pagePathname: this.infra.authLocation.currentPagePathname(),
                instantly: false,
            }),
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

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>

type DelayTime = Readonly<{ delay_milli_second: number }>
