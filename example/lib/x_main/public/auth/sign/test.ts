import { initLoginViewLocationInfo, View } from "./impl"

import { newBoardValidateStack } from "../../../../z_getto/board/kernel/infra/stack"
import { initStaticClock } from "../../../../z_getto/infra/clock/simulate"
import { initAuthenticatePasswordSimulate } from "../../../../auth/sign/password/authenticate/infra/remote/authenticate/simulate"
import { initRenewAuthnInfoSimulate } from "../../../../auth/sign/kernel/authnInfo/kernel/infra/remote/renew/simulate"

import { Clock } from "../../../../z_getto/infra/clock/infra"
import { AuthenticatePasswordResult } from "../../../../auth/sign/password/authenticate/infra"

import { AuthSignActionState } from "./entryPoint"

import { markAuthAt, markAuthnNonce } from "../../../../auth/sign/kernel/authnInfo/kernel/data"
import { markApiNonce, markApiRoles } from "../../../../common/apiCredential/data"
import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/memory"
import {
    AuthnInfoRepository,
    RenewAuthnInfoResult,
} from "../../../../auth/sign/kernel/authnInfo/kernel/infra"
import { delayed, wait } from "../../../../z_getto/infra/delayed/core"
import { initMemoryAuthnInfoRepository } from "../../../../auth/sign/kernel/authnInfo/kernel/infra/repository/authnInfo/memory"
import { newGetSecureScriptPathLocationInfo } from "../../../../auth/sign/common/secureScriptPath/get/impl"
import {
    initRenewAuthnInfoAction,
    toRenewAuthnInfoEntryPoint,
} from "../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/impl"
import { initAuthenticatePasswordFormAction } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/Form/impl"
import { initAuthenticatePasswordCoreAction } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/Core/impl"
import {
    toAuthenticatePasswordAction,
    toAuthenticatePasswordEntryPoint,
} from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/impl"
import { toRequestPasswordResetTokenEntryPoint } from "../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/impl"
import { initRequestPasswordResetTokenCoreAction } from "../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/Core/impl"
import {
    initCheckPasswordResetSendingStatusAction,
    toCheckPasswordResetSendingStatusEntryPoint,
} from "../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/impl"
import { newCheckPasswordResetSendingStatusLocationInfo } from "../../../../auth/sign/password/reset/checkStatus/impl"
import { initResetPasswordCoreAction } from "../../../../auth/sign/password/reset/reset/x_Action/Reset/Core/impl"
import { toResetPasswordEntryPoint } from "../../../../auth/sign/password/reset/reset/x_Action/Reset/impl"
import { initResetPasswordSimulate } from "../../../../auth/sign/password/reset/reset/infra/remote/reset/simulate"
import { initResetPasswordFormAction } from "../../../../auth/sign/password/reset/reset/x_Action/Reset/Form/impl"
import { initRequestPasswordResetTokenSimulate } from "../../../../auth/sign/password/reset/requestToken/infra/remote/requestToken/simulate"
import { initRequestPasswordResetTokenFormAction } from "../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/Form/impl"
import { initSendPasswordResetTokenSimulate } from "../../../../auth/sign/password/reset/checkStatus/infra/remote/sendToken/simulate"
import { initGetPasswordResetSendingStatusSimulate } from "../../../../auth/sign/password/reset/checkStatus/infra/remote/getStatus/simulate"
import { ResetPasswordResult } from "../../../../auth/sign/password/reset/reset/infra"
import { RequestPasswordResetTokenResult } from "../../../../auth/sign/password/reset/requestToken/infra"
import { markPasswordResetSessionID } from "../../../../auth/sign/password/reset/kernel/data"
import {
    GetPasswordResetSendingStatusResult,
    SendPasswordResetTokenResult,
} from "../../../../auth/sign/password/reset/checkStatus/infra"
import { newResetPasswordLocationInfo } from "../../../../auth/sign/password/reset/reset/impl"

const AUTHORIZED_AUTHN_NONCE = "authn-nonce" as const
const SUCCEED_TO_AUTH_AT = new Date("2020-01-01 10:00:00")

const SESSION_ID = "session-id" as const

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_AUTH_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

describe("LoginView", () => {
    test("redirect login view", (done) => {
        const { view } = standardLoginView()

        const ignition = view.ignition()
        ignition.addStateHandler(stateHandler())

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
        ignition.addStateHandler(stateHandler())

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
        ignition.addStateHandler(stateHandler())

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
        ignition.addStateHandler(stateHandler())

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
        ignition.addStateHandler(stateHandler())

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
        password_authenticate: () =>
            standardPasswordLoginEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () =>
            standardCheckPasswordResetSendingStatusResource(currentURL),
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
        password_authenticate: () =>
            standardPasswordLoginEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () =>
            standardCheckPasswordResetSendingStatusResource(currentURL),
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
        password_authenticate: () =>
            standardPasswordLoginEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () =>
            standardCheckPasswordResetSendingStatusResource(currentURL),
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
        password_authenticate: () =>
            standardPasswordLoginEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock,
            ),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () =>
            standardCheckPasswordResetSendingStatusResource(currentURL),
    })

    return { view }
}

function standardPasswordLoginEntryPoint(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock,
) {
    return toAuthenticatePasswordEntryPoint(
        toAuthenticatePasswordAction({
            core: initAuthenticatePasswordCoreAction(
                {
                    startContinuousRenew: {
                        apiCredentials,
                        authnInfos,
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
                    authenticate: {
                        login: initAuthenticatePasswordSimulate(simulateLogin, {
                            wait_millisecond: 0,
                        }),
                        config: {
                            delay: { delay_millisecond: 1 },
                        },
                        delayed,
                    },
                },
                newGetSecureScriptPathLocationInfo(currentURL),
            ),

            form: initAuthenticatePasswordFormAction({
                stack: newBoardValidateStack(),
            }),
        }),
    )
}
function standardPasswordResetResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock,
) {
    return toResetPasswordEntryPoint({
        core: initResetPasswordCoreAction(
            {
                startContinuousRenew: {
                    apiCredentials,
                    authnInfos,
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
                reset: {
                    reset: initResetPasswordSimulate(simulateReset, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        delay: { delay_millisecond: 1 },
                    },
                    delayed,
                },
            },
            {
                ...newGetSecureScriptPathLocationInfo(currentURL),
                ...newResetPasswordLocationInfo(currentURL),
            },
        ),

        form: initResetPasswordFormAction({
            stack: newBoardValidateStack(),
        }),
    })
}
function standardRequestPasswordResetTokenResource() {
    return toRequestPasswordResetTokenEntryPoint({
        core: initRequestPasswordResetTokenCoreAction({
            request: {
                request: initRequestPasswordResetTokenSimulate(simulateRequestToken, {
                    wait_millisecond: 0,
                }),
                config: {
                    delay: { delay_millisecond: 1 },
                },
                delayed,
            },
        }),

        form: initRequestPasswordResetTokenFormAction({
            stack: newBoardValidateStack(),
        }),
    })
}
function standardCheckPasswordResetSendingStatusResource(currentURL: URL) {
    return toCheckPasswordResetSendingStatusEntryPoint(
        initCheckPasswordResetSendingStatusAction(
            {
                checkStatus: {
                    sendToken: initSendPasswordResetTokenSimulate(simulateSendToken, {
                        wait_millisecond: 0,
                    }),
                    getStatus: initGetPasswordResetSendingStatusSimulate(simulateGetStatus, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        wait: { wait_millisecond: 2 },
                        limit: { limit: 5 },
                    },
                    wait,
                },
            },
            newCheckPasswordResetSendingStatusLocationInfo(currentURL),
        ),
    )
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

function simulateLogin(): AuthenticatePasswordResult {
    return {
        success: true,
        value: {
            auth: {
                authnNonce: markAuthnNonce(AUTHORIZED_AUTHN_NONCE),
                authAt: markAuthAt(SUCCEED_TO_AUTH_AT),
            },
            api: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        },
    }
}
function simulateRenew(): RenewAuthnInfoResult {
    return {
        success: false,
        err: { type: "invalid-ticket" },
    }
}
function simulateReset(): ResetPasswordResult {
    return {
        success: true,
        value: {
            auth: {
                authnNonce: markAuthnNonce(AUTHORIZED_AUTHN_NONCE),
                authAt: markAuthAt(SUCCEED_TO_AUTH_AT),
            },
            api: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        },
    }
}

function simulateRequestToken(): RequestPasswordResetTokenResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}
function simulateSendToken(): SendPasswordResetTokenResult {
    return { success: true, value: true }
}
function simulateGetStatus(): GetPasswordResetSendingStatusResult {
    return { success: true, value: { done: true, send: true } }
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
