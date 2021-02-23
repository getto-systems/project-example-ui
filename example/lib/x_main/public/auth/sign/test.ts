import { initLoginViewLocationInfo, View } from "./impl"

import { initStaticClock } from "../../../../z_getto/infra/clock/simulate"
import { initRenewAuthnInfoSimulate } from "../../../../auth/sign/kernel/authnInfo/kernel/infra/remote/renew/simulate"

import { Clock } from "../../../../z_getto/infra/clock/infra"

import { AuthSignActionState } from "./entryPoint"

import { markApiNonce, markApiRoles } from "../../../../common/apiCredential/data"
import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/memory"
import {
    AuthnInfoRepository,
    RenewAuthnInfoResult,
} from "../../../../auth/sign/kernel/authnInfo/kernel/infra"
import { delayed } from "../../../../z_getto/infra/delayed/core"
import { initMemoryAuthnInfoRepository } from "../../../../auth/sign/kernel/authnInfo/kernel/infra/repository/authnInfo/memory"
import { newGetSecureScriptPathLocationInfo } from "../../../../auth/sign/common/secureScriptPath/get/impl"
import {
    initRenewAuthnInfoAction,
    toRenewAuthnInfoEntryPoint,
} from "../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/impl"
import { initMockAuthenticatePasswordResource } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/mock"
import { initMockRequestPasswordResetTokenResource } from "../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/mock"
import { initMockResetPasswordResource } from "../../../../auth/sign/password/reset/reset/x_Action/Reset/mock"
import { initMockStartPasswordResetSessionResource } from "../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/mock"

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_AUTH_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

describe("LoginView", () => {
    test("redirect login view", (done) => {
        const { view } = standardLoginView()

        const ignition = view.ignition()
        ignition.subscribe(stateHandler())

        ignition.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.ignition().ignite()
                        break

                    case "password-authenticate":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-authenticate" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset request token", (done) => {
        const { view } = passwordResetSessionLoginView()

        const ignition = view.ignition()
        ignition.subscribe(stateHandler())

        ignition.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.ignition().ignite()
                        break

                    case "password-reset-requestToken":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-requestToken" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset check status", (done) => {
        const { view } = passwordResetCheckStatusLoginView()

        const ignition = view.ignition()
        ignition.subscribe(stateHandler())

        ignition.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.ignition().ignite()
                        break

                    case "password-reset-checkStatus":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-checkStatus" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset", (done) => {
        const { view } = passwordResetLoginView()

        const ignition = view.ignition()
        ignition.subscribe(stateHandler())

        ignition.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.ignition().ignite()
                        break

                    case "password-reset":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("error", (done) => {
        const { view } = standardLoginView()

        const ignition = view.ignition()
        ignition.subscribe(stateHandler())

        view.error("view error")

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        expect(stack).toEqual([{ type: "error", err: "view error" }])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardLoginView() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () =>
            standardRenewCredentialEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}
function passwordResetSessionLoginView() {
    const currentURL = passwordResetSessionURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () =>
            standardRenewCredentialEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}
function passwordResetCheckStatusLoginView() {
    const currentURL = passwordResetCheckStatusURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () =>
            standardRenewCredentialEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}
function passwordResetLoginView() {
    const currentURL = passwordResetURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () =>
            standardRenewCredentialEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}

function standardPasswordLoginEntryPoint() {
    return {
        resource: initMockAuthenticatePasswordResource(),
        terminate: () => null,
    }
}
function standardPasswordResetResource() {
    return {
        resource: initMockResetPasswordResource(),
        terminate: () => null,
    }
}
function standardRequestPasswordResetTokenResource() {
    return {
        resource: initMockRequestPasswordResetTokenResource(),
        terminate: () => null,
    }
}
function standardCheckPasswordResetSendingStatusResource() {
    return {
        resource: initMockStartPasswordResetSessionResource(),
        terminate: () => null,
    }
}
function standardRenewCredentialEntryPoint(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock,
) {
    return toRenewAuthnInfoEntryPoint(
        initRenewAuthnInfoAction(
            {
                renew: {
                    apiCredentials,
                    authnInfos,
                    renew: initRenewAuthnInfoSimulate(simulateRenew, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        instantLoadExpire: { expire_millisecond: 20 * 1000 },
                        delay: { delay_millisecond: 1 },
                    },
                    delayed,
                    clock,
                },
                startContinuousRenew: {
                    apiCredentials,
                    authnInfos: authnInfos,
                    renew: initRenewAuthnInfoSimulate(simulateRenew, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        delay: { delay_millisecond: 1 },
                        interval: { interval_millisecond: 1 },
                    },
                    clock,
                },
                getSecureScriptPath: {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                },
            },
            newGetSecureScriptPathLocationInfo(currentURL),
        ),
    )
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function passwordResetSessionURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=request")
}
function passwordResetCheckStatusURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=checkStatus")
}
function passwordResetURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=reset")
}

function standardSecureHost(): string {
    return "secure.example.com"
}

function simulateRenew(): RenewAuthnInfoResult {
    return {
        success: false,
        err: { type: "invalid-ticket" },
    }
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        }),
        authnInfos: initMemoryAuthnInfoRepository({
            authnNonce: { set: false },
            lastAuthAt: { set: false },
        }),
    }
}

function standardClock(): Clock {
    return initStaticClock(NOW)
}

interface Handler<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
