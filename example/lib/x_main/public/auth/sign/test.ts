import { initLoginViewLocationInfo, View } from "./impl"

import { newBoardValidateStack } from "../../../../z_getto/board/kernel/infra/stack"
import { initStaticClock } from "../../../../z_getto/infra/clock/simulate"
import { initAuthenticatePasswordSimulate } from "../../../../auth/sign/password/authenticate/infra/remote/authenticate/simulate"
import { initRenewAuthnInfoSimulate } from "../../../../auth/sign/kernel/authnInfo/kernel/infra/remote/renew/simulate"
import { initRegisterPasswordSimulate } from "../../../../auth/sign/password/resetSession/register/infra/remote/register/simulate"
import { initStartPasswordResetSessionSimulate } from "../../../../auth/sign/password/resetSession/start/infra/remote/start/simulate"

import { newAuthSignLinkResource } from "../../../../auth/sign/common/searchParams/x_Action/Link/impl"

import { initFormAction } from "../../../../z_getto/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../auth/common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../auth/common/field/password/main/password"

import { Clock } from "../../../../z_getto/infra/clock/infra"
import { AuthenticatePasswordResult } from "../../../../auth/sign/password/authenticate/infra"
import { RegisterPasswordResult } from "../../../../auth/sign/password/resetSession/register/infra"

import { AuthSignViewState } from "./entryPoint"

import { markAuthAt, markAuthnNonce } from "../../../../auth/sign/kernel/authnInfo/kernel/data"
import { markApiNonce, markApiRoles } from "../../../../common/apiCredential/data"
import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/memory"
import { AuthnInfoRepository, RenewAuthnInfoResult } from "../../../../auth/sign/kernel/authnInfo/kernel/infra"
import { delayed, wait } from "../../../../z_getto/infra/delayed/core"
import { initMemoryAuthnInfoRepository } from "../../../../auth/sign/kernel/authnInfo/kernel/infra/repository/authnInfo/memory"
import { initGetSecureScriptPathLocationInfo } from "../../../../auth/sign/common/secureScriptPath/get/impl"
import { initRegisterPasswordLocationInfo } from "../../../../auth/sign/password/resetSession/register/impl"
import {
    GetPasswordResetSessionStatusResult,
    SendPasswordResetSessionTokenResult,
    StartPasswordResetSessionSessionResult,
} from "../../../../auth/sign/password/resetSession/start/infra"
import { markPasswordResetSessionID } from "../../../../auth/sign/password/resetSession/start/data"
import { initSendPasswordResetSessionTokenSimulate } from "../../../../auth/sign/password/resetSession/start/infra/remote/sendToken/simulate"
import { initGetPasswordResetSessionStatusSimulate } from "../../../../auth/sign/password/resetSession/start/infra/remote/getStatus/simulate"
import { initRenewAuthnInfoAction } from "../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/impl"
import { initAuthenticatePasswordFormAction } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/Form/impl"
import { initAuthenticatePasswordCoreAction } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/Core/impl"
import { initRegisterPasswordAction } from "../../../../auth/sign/x_Action/Password/ResetSession/Register/Core/impl"
import { initRegisterPasswordFormAction } from "../../../../auth/sign/x_Action/Password/ResetSession/Register/Form/impl"
import { initStartPasswordResetSessionFormAction } from "../../../../auth/sign/x_Action/Password/ResetSession/Start/Form/impl"
import { initStartPasswordResetSessionAction } from "../../../../auth/sign/x_Action/Password/ResetSession/Start/Core/impl"
import { toAuthenticatePasswordEntryPoint } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/impl"

const AUTHORIZED_AUTHN_NONCE = "authn-nonce" as const
const SUCCEED_TO_AUTH_AT = new Date("2020-01-01 10:00:00")

const SESSION_ID = "session-id" as const

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_AUTH_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

describe("LoginView", () => {
    test("redirect login view", (done) => {
        const { view } = standardLoginView()

        view.addStateHandler(stateHandler())

        view.load()

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.request()
                        break

                    case "password-login":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-login" })

                        expect(state.entryPoint.resource.href.passwordLogin()).toEqual(
                            "?_password_login"
                        )
                        expect(state.entryPoint.resource.href.passwordResetSession()).toEqual(
                            "?_password_reset=start"
                        )

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-reset-session":
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

    test("password reset session", (done) => {
        const { view } = passwordResetSessionLoginView()

        view.addStateHandler(stateHandler())

        view.load()

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.request()
                        break

                    case "password-reset-session":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-session" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-login":
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

        view.addStateHandler(stateHandler())

        view.load()

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.renew.request()
                        break

                    case "password-reset":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-login":
                    case "password-reset-session":
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

        view.addStateHandler(stateHandler())

        view.error("view error")

        function stateHandler(): Handler<AuthSignViewState> {
            const stack: AuthSignViewState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                    case "password-login":
                    case "password-reset-session":
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
        link: newAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetSessionLoginView() {
    const currentURL = passwordResetSessionURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: newAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetLoginView() {
    const currentURL = passwordResetURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: newAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginEntryPoint(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authnInfos,
                clock
            ),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}

function standardPasswordLoginEntryPoint(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock
) {
    return toAuthenticatePasswordEntryPoint({
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
            initGetSecureScriptPathLocationInfo(currentURL)
        ),

        form: initAuthenticatePasswordFormAction({
            stack: newBoardValidateStack(),
        }),
    })
}
function standardPasswordResetResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock
) {
    return {
        register: initRegisterPasswordAction(
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
                register: {
                    register: initRegisterPasswordSimulate(simulateReset, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        delay: { delay_millisecond: 1 },
                    },
                    delayed,
                },
            },
            {
                ...initGetSecureScriptPathLocationInfo(currentURL),
                ...initRegisterPasswordLocationInfo(currentURL),
            }
        ),

        form: initRegisterPasswordFormAction(formMaterial()),
    }

    function formMaterial() {
        const form = initFormAction()
        const loginID = initLoginIDFormFieldAction()
        const password = initPasswordFormFieldAction()
        return {
            validation: form.validation(),
            history: form.history(),
            loginID: loginID.field(),
            password: password.field(),
            character: password.character(),
            viewer: password.viewer(),
        }
    }
}
function standardPasswordResetSessionResource() {
    return {
        start: initStartPasswordResetSessionAction({
            start: {
                start: initStartPasswordResetSessionSimulate(simulateStartSession, {
                    wait_millisecond: 0,
                }),
                config: {
                    delay: { delay_millisecond: 1 },
                },
                delayed,
            },
            checkStatus: {
                sendToken: initSendPasswordResetSessionTokenSimulate(simulateSendToken, {
                    wait_millisecond: 0,
                }),
                getStatus: initGetPasswordResetSessionStatusSimulate(simulateGetStatus, {
                    wait_millisecond: 0,
                }),
                config: {
                    wait: { wait_millisecond: 2 },
                    limit: { limit: 5 },
                },
                wait,
            },
        }),
        form: initStartPasswordResetSessionFormAction(formMaterial()),
    }

    function formMaterial() {
        const form = initFormAction()
        const loginID = initLoginIDFormFieldAction()
        return {
            validation: form.validation(),
            history: form.history(),
            loginID: loginID.field(),
        }
    }
}
function standardRenewCredentialResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authnInfos: AuthnInfoRepository,
    clock: Clock
) {
    return {
        renew: initRenewAuthnInfoAction(
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
            initGetSecureScriptPathLocationInfo(currentURL)
        ),
    }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function passwordResetSessionURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=start")
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
function simulateReset(): RegisterPasswordResult {
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

function simulateStartSession(): StartPasswordResetSessionSessionResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}
function simulateSendToken(): SendPasswordResetSessionTokenResult {
    return { success: true, value: true }
}
function simulateGetStatus(): GetPasswordResetSessionStatusResult {
    return { success: true, value: { dest: { type: "log" }, done: true, send: true } }
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
