import { initLoginViewLocationInfo, View } from "./impl"
import { initLoginLocationInfo } from "../../x_Resource/common/LocationInfo/impl"

import { initStaticClock } from "../../../z_infra/clock/simulate"
import { initLoginSimulateRemoteAccess } from "../../sign/password/login/infra/remote/login/simulate"
import { initRenewSimulateRemoteAccess } from "../../sign/authCredential/common/infra/remote/renew/simulate"
import { initResetSimulateRemoteAccess } from "../../sign/password/reset/register/infra/remote/register/simulate"
import {
    initGetStatusSimulateRemoteAccess,
    initSendTokenSimulateRemoteAccess,
    initStartSessionSimulateRemoteAccess,
} from "../../sign/password/reset/session/infra/remote/startSession/simulate"

import { initLoginLinkResource } from "../../x_Resource/common/LoginLink/impl"
import { initRenewCredentialResource } from "../../x_Resource/Sign/RenewCredential/impl"
import { initPasswordLoginResource } from "../../x_Resource/Sign/PasswordLogin/impl"
import { initPasswordResetSessionResource } from "../../x_Resource/Sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "../../x_Resource/Sign/PasswordReset/impl"

import { initFormAction } from "../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../common/field/password/main/password"

import { Clock } from "../../../z_infra/clock/infra"
import { LoginRemoteAccessResult } from "../../sign/password/login/infra"
import { RegisterRemoteAccessResult } from "../../sign/password/reset/register/infra"

import { LoginState } from "./entryPoint"

import { markAuthAt, markTicketNonce } from "../../sign/authCredential/common/data"
import { markApiNonce, markApiRoles } from "../../../common/apiCredential/data"
import { ApiCredentialRepository } from "../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../common/apiCredential/infra/repository/memory"
import {
    AuthCredentialRepository,
    RenewRemoteAccessResult,
} from "../../sign/authCredential/common/infra"
import { initContinuousRenewAction } from "../../sign/authCredential/continuousRenew/impl"
import { initRenewAction } from "../../sign/authCredential/renew/impl"
import { delayed, wait } from "../../../z_infra/delayed/core"
import { initMemoryAuthCredentialRepository } from "../../sign/authCredential/common/infra/repository/memory"
import { detectPagePathname, initLocationAction } from "../../sign/location/impl"
import { initLoginActionPod } from "../../sign/password/login/impl"
import { initRegisterActionPod } from "../../sign/password/reset/register/impl"
import { initSessionActionPod } from "../../sign/password/reset/session/impl"
import {
    GetStatusRemoteAccessResult,
    SendTokenRemoteAccessResult,
    StartSessionRemoteAccessResult,
} from "../../sign/password/reset/session/infra"
import { markSessionID } from "../../sign/password/reset/session/data"

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

        function stateHandler(): Handler<LoginState> {
            const stack: LoginState[] = []
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

                        expect(state.entryPoint.resource.link.passwordLogin()).toEqual(
                            "?_password_login"
                        )
                        expect(state.entryPoint.resource.link.passwordResetSession()).toEqual(
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

        function stateHandler(): Handler<LoginState> {
            const stack: LoginState[] = []
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

        function stateHandler(): Handler<LoginState> {
            const stack: LoginState[] = []
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

        function stateHandler(): Handler<LoginState> {
            const stack: LoginState[] = []
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
        loginLink: initLoginLinkResource,
        renewCredential: () =>
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
        loginLink: initLoginLinkResource,
        renewCredential: () =>
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
        loginLink: initLoginLinkResource,
        renewCredential: () =>
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
    return initPasswordLoginResource(
        {
            continuousRenew: initContinuousRenewAction({
                apiCredentials,
                authCredentials,
                renew: initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
                config: {
                    delay: { delay_millisecond: 1 },
                    interval: { interval_millisecond: 1 },
                },
                clock,
            }),
            location: initLocationAction(
                { getPagePathname: () => detectPagePathname(currentURL) },
                {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                }
            ),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        {
            initLogin: initLoginActionPod({
                login: initLoginSimulateRemoteAccess(simulateLogin, { wait_millisecond: 0 }),
                config: {
                    delay: { delay_millisecond: 1 },
                },
                delayed,
            }),
        }
    )
}
function standardPasswordResetResource(
    currentURL: URL,
    apiCredentials: ApiCredentialRepository,
    authCredentials: AuthCredentialRepository,
    clock: Clock
) {
    return initPasswordResetResource(
        initLoginLocationInfo(currentURL),
        {
            continuousRenew: initContinuousRenewAction({
                apiCredentials,
                authCredentials,
                renew: initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
                config: {
                    delay: { delay_millisecond: 1 },
                    interval: { interval_millisecond: 1 },
                },
                clock,
            }),
            location: initLocationAction(
                { getPagePathname: () => detectPagePathname(currentURL) },
                {
                    config: {
                        secureServerHost: standardSecureHost(),
                    },
                }
            ),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        {
            initRegister: initRegisterActionPod({
                register: initResetSimulateRemoteAccess(simulateReset, { wait_millisecond: 0 }),
                config: {
                    delay: { delay_millisecond: 1 },
                },
                delayed,
            }),
        }
    )
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
            initSession: initSessionActionPod({
                startSession: initStartSessionSimulateRemoteAccess(simulateStartSession, {
                    wait_millisecond: 0,
                }),
                sendToken: initSendTokenSimulateRemoteAccess(simulateSendToken, {
                    wait_millisecond: 0,
                }),
                getStatus: initGetStatusSimulateRemoteAccess(simulateGetStatus, {
                    wait_millisecond: 0,
                }),
                config: {
                    startSession: {
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
    return initRenewCredentialResource({
        renew: initRenewAction({
            apiCredentials,
            authCredentials,
            renew: initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
            config: {
                instantLoadExpire: { expire_millisecond: 20 * 1000 },
                delay: { delay_millisecond: 1 },
            },
            delayed,
            clock,
        }),
        continuousRenew: initContinuousRenewAction({
            apiCredentials,
            authCredentials,
            renew: initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
            config: {
                delay: { delay_millisecond: 1 },
                interval: { interval_millisecond: 1 },
            },
            clock,
        }),
        location: initLocationAction(
            { getPagePathname: () => detectPagePathname(currentURL) },
            {
                config: {
                    secureServerHost: standardSecureHost(),
                },
            }
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

function simulateLogin(): LoginRemoteAccessResult {
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
function simulateRenew(): RenewRemoteAccessResult {
    return {
        success: false,
        err: { type: "invalid-ticket" },
    }
}
function simulateReset(): RegisterRemoteAccessResult {
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

function simulateStartSession(): StartSessionRemoteAccessResult {
    return { success: true, value: markSessionID(SESSION_ID) }
}
function simulateSendToken(): SendTokenRemoteAccessResult {
    return { success: true, value: true }
}
function simulateGetStatus(): GetStatusRemoteAccessResult {
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
