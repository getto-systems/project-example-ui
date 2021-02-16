import { initLoginViewLocationInfo, View } from "./impl"

import { initStaticClock } from "../../../z_infra/clock/simulate"
import { initSubmitPasswordLoginSimulateRemoteAccess } from "../../sign/password/login/infra/remote/submitPasswordLogin/simulate"
import { initRenewAuthCredentialSimulateRemoteAccess } from "../../sign/authCredential/common/infra/remote/renewAuthCredential/simulate"
import { initSubmitPasswordResetResetSimulateRemoteAccess } from "../../sign/password/reset/register/infra/remote/submitPasswordResetRegister/simulate"
import { initStartPasswordResetSessionSimulateRemoteAccess } from "../../sign/password/reset/session/infra/remote/startPasswordResetSession/simulate"

import { initAuthSignLinkResource } from "./resources/Link/impl"
import { initAuthSignRenewResource } from "./resources/Renew/impl"
import { initAuthSignPasswordLoginResource } from "./resources/Password/Login/impl"
import { initPasswordResetSessionResource } from "../../x_Resource/sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "./resources/Password/Reset/Register/impl"

import { initFormAction } from "../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../common/field/password/main/password"

import { Clock } from "../../../z_infra/clock/infra"
import { SubmitLoginRemoteAccessResult } from "../../sign/password/login/infra"
import { SubmitPasswordResetRegisterRemoteAccessResult } from "../../sign/password/reset/register/infra"

import { AuthSignViewState } from "./entryPoint"

import { markAuthAt, markTicketNonce } from "../../sign/authCredential/common/data"
import { markApiNonce, markApiRoles } from "../../../common/apiCredential/data"
import { ApiCredentialRepository } from "../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../common/apiCredential/infra/repository/memory"
import {
    AuthCredentialRepository,
    RenewAuthCredentialRemoteAccessResult,
} from "../../sign/authCredential/common/infra"
import { initContinuousRenewAuthCredentialAction } from "../../sign/authCredential/continuousRenew/impl"
import { initRenewAuthCredentialAction } from "../../sign/authCredential/renew/impl"
import { delayed, wait } from "../../../z_infra/delayed/core"
import { initMemoryAuthCredentialRepository } from "../../sign/authCredential/common/infra/repository/authCredential/memory"
import { initAuthLocationAction, initAuthLocationActionLocationInfo } from "../../sign/authLocation/impl"
import { initPasswordLoginAction, initPasswordLoginActionPod } from "../../sign/password/login/impl"
import {
    initPasswordResetRegisterAction,
    initPasswordResetRegisterActionLocationInfo,
    initPasswordResetRegisterActionPod,
} from "../../sign/password/reset/register/impl"
import { initPasswordResetSessionActionPod } from "../../sign/password/reset/session/impl"
import {
    GetPasswordResetSessionStatusRemoteAccessResult,
    SendPasswordResetSessionTokenRemoteAccessResult,
    StartPasswordResetSessionSessionRemoteAccessResult,
} from "../../sign/password/reset/session/infra"
import { markPasswordResetSessionID } from "../../sign/password/reset/session/data"
import { initSendPasswordResetSessionTokenSimulateRemoteAccess } from "../../sign/password/reset/session/infra/remote/sendPasswordResetSessionToken/simulate"
import { initGetPasswordResetSessionStatusSimulateRemoteAccess } from "../../sign/password/reset/session/infra/remote/getPasswordResetSessionStatus/simulate"

const AUTHORIZED_TICKET_NONCE = "ticket-nonce" as const
const SUCCEED_TO_LOGIN_AT = new Date("2020-01-01 10:00:00")

const SESSION_ID = "session-id" as const

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
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
        link: initAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
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
        link: initAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
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
        link: initAuthSignLinkResource,
        renew: () =>
            standardRenewCredentialResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
                clock
            ),
        passwordLogin: () =>
            standardPasswordLoginResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
                clock
            ),
        passwordReset: () =>
            standardPasswordResetResource(
                currentURL,
                repository.apiCredentials,
                repository.authCredentials,
                clock
            ),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}

function standardPasswordLoginResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authCredentials: AuthCredentialRepository,
    clock: Clock
) {
    return initAuthSignPasswordLoginResource({
        login: {
            continuousRenew: initContinuousRenewAuthCredentialAction({
                apiCredentials,
                authCredentials,
                renew: initRenewAuthCredentialSimulateRemoteAccess(simulateRenew, {
                    wait_millisecond: 0,
                }),
                config: {
                    delay: { delay_millisecond: 1 },
                    interval: { interval_millisecond: 1 },
                },
                clock,
            }),
            location: initAuthLocationAction(
                {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                },
                initAuthLocationActionLocationInfo(currentURL)
            ),
            login: initPasswordLoginAction(
                initPasswordLoginActionPod({
                    login: initSubmitPasswordLoginSimulateRemoteAccess(simulateLogin, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        delay: { delay_millisecond: 1 },
                    },
                    delayed,
                })
            ),
        },

        form: formMaterial(),
    })

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
function standardPasswordResetResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authCredentials: AuthCredentialRepository,
    clock: Clock
) {
    return initPasswordResetResource({
        register: {
            continuousRenew: initContinuousRenewAuthCredentialAction({
                apiCredentials,
                authCredentials,
                renew: initRenewAuthCredentialSimulateRemoteAccess(simulateRenew, {
                    wait_millisecond: 0,
                }),
                config: {
                    delay: { delay_millisecond: 1 },
                    interval: { interval_millisecond: 1 },
                },
                clock,
            }),
            location: initAuthLocationAction(
                {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                },
                initAuthLocationActionLocationInfo(currentURL)
            ),
            register: initPasswordResetRegisterAction(
                initPasswordResetRegisterActionPod({
                    register: initSubmitPasswordResetResetSimulateRemoteAccess(simulateReset, {
                        wait_millisecond: 0,
                    }),
                    config: {
                        delay: { delay_millisecond: 1 },
                    },
                    delayed,
                }),
                initPasswordResetRegisterActionLocationInfo(currentURL)
            ),
        },

        form: formMaterial(),
    })

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
    return initPasswordResetSessionResource(
        {
            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
            },
        },
        {
            initSession: initPasswordResetSessionActionPod({
                start: initStartPasswordResetSessionSimulateRemoteAccess(simulateStartSession, {
                    wait_millisecond: 0,
                }),
                sendToken: initSendPasswordResetSessionTokenSimulateRemoteAccess(simulateSendToken, {
                    wait_millisecond: 0,
                }),
                getStatus: initGetPasswordResetSessionStatusSimulateRemoteAccess(simulateGetStatus, {
                    wait_millisecond: 0,
                }),
                config: {
                    start: {
                        delay: { delay_millisecond: 1 },
                    },
                    checkStatus: {
                        wait: { wait_millisecond: 2 },
                        limit: { limit: 5 },
                    },
                },
                delayed,
                wait,
            }),
        }
    )
}
function standardRenewCredentialResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authCredentials: AuthCredentialRepository,
    clock: Clock
) {
    return initAuthSignRenewResource({
        renew: initRenewAuthCredentialAction({
            apiCredentials,
            authCredentials,
            renew: initRenewAuthCredentialSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
            config: {
                instantLoadExpire: { expire_millisecond: 20 * 1000 },
                delay: { delay_millisecond: 1 },
            },
            delayed,
            clock,
        }),
        continuousRenew: initContinuousRenewAuthCredentialAction({
            apiCredentials,
            authCredentials,
            renew: initRenewAuthCredentialSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
            config: {
                delay: { delay_millisecond: 1 },
                interval: { interval_millisecond: 1 },
            },
            clock,
        }),
        location: initAuthLocationAction(
            {
                config: {
                    secureServerHost: standardSecureHost(),
                },
            },
            initAuthLocationActionLocationInfo(currentURL)
        ),
    })
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

function simulateLogin(): SubmitLoginRemoteAccessResult {
    return {
        success: true,
        value: {
            auth: {
                ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
                authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
            },
            api: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        },
    }
}
function simulateRenew(): RenewAuthCredentialRemoteAccessResult {
    return {
        success: false,
        err: { type: "invalid-ticket" },
    }
}
function simulateReset(): SubmitPasswordResetRegisterRemoteAccessResult {
    return {
        success: true,
        value: {
            auth: {
                ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
                authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
            },
            api: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        },
    }
}

function simulateStartSession(): StartPasswordResetSessionSessionRemoteAccessResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}
function simulateSendToken(): SendPasswordResetSessionTokenRemoteAccessResult {
    return { success: true, value: true }
}
function simulateGetStatus(): GetPasswordResetSessionStatusRemoteAccessResult {
    return { success: true, value: { dest: { type: "log" }, done: true, send: true } }
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        }),
        authCredentials: initMemoryAuthCredentialRepository({
            ticketNonce: { set: false },
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
