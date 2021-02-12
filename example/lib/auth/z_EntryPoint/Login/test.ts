import { initLoginViewLocationInfo } from "./impl/location"

import { initStaticClock } from "../../../z_infra/clock/simulate"
import { initTestAuthCredentialStorage } from "../../login/credentialStore/tests/storage"
import { initLoginSimulateRemoteAccess } from "../../login/passwordLogin/impl/remote/login/simulate"
import { initRenewSimulateRemoteAccess } from "../../login/credentialStore/impl/remote/renew/simulate"
import { initResetSimulateRemoteAccess } from "../../profile/passwordReset/impl/remote/reset/simulate"
import {
    initGetStatusSimulateRemoteAccess,
    initSendTokenSimulateRemoteAccess,
    initStartSessionSimulateRemoteAccess,
} from "../../profile/passwordReset/impl/remote/session/simulate"

import { initAuthCredentialRepository } from "../../login/credentialStore/impl/repository/authCredential"

import { Clock } from "../../../z_infra/clock/infra"
import { LoginRemoteAccessResult } from "../../login/passwordLogin/infra"
import { AuthCredentialRepository, RenewRemoteAccessResult } from "../../login/credentialStore/infra"
import {
    GetStatusRemoteAccessResult,
    ResetRemoteAccessResult,
    SendTokenRemoteAccessResult,
    StartSessionRemoteAccessResult,
} from "../../profile/passwordReset/infra"

import { RenewCredentialComponent } from "../../x_Resource/Login/RenewCredential/Renew/component"

import { markApiCredential, markAuthAt, markTicketNonce } from "../../common/credential/data"
import { markSessionID } from "../../profile/passwordReset/data"

import { View } from "./impl/core"
import { LoginState } from "./entryPoint"
import { initPasswordResetSessionResource } from "../../x_Resource/Profile/PasswordResetSession/impl"
import { initLoginLink } from "../../x_Resource/common/impl/link"
import { initTestApplicationAction } from "../../common/application/tests/application"
import { initFormAction } from "../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../common/field/loginID/main/loginID"
import { initTestPasswordResetSessionAction } from "../../profile/passwordReset/tests/session"
import { initPasswordLoginResource } from "../../x_Resource/Login/PasswordLogin/impl"
import { initLoginLocationInfo } from "../../x_Resource/common/impl/location"
import {
    initTestRenewAction,
    initTestSetContinuousRenewAction,
} from "../../login/credentialStore/tests/renew"
import { initPasswordFormFieldAction } from "../../common/field/password/main/password"
import { initTestPasswordLoginAction } from "../../login/passwordLogin/tests/login"
import { initRenewCredentialResource } from "../../x_Resource/Login/RenewCredential/impl"
import { initTestPasswordResetAction } from "../../profile/passwordReset/tests/reset"
import { initPasswordResetResource } from "../../x_Resource/Profile/PasswordReset/impl"

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
        renewCredential: (setup) =>
            standardRenewCredentialResource(currentURL, repository.authCredentials, clock, setup),
        passwordLogin: () =>
            standardPasswordLoginResource(currentURL, repository.authCredentials, clock),
        passwordReset: () =>
            standardPasswordResetResource(currentURL, repository.authCredentials, clock),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetSessionLoginView() {
    const currentURL = passwordResetSessionURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renewCredential: (setup) =>
            standardRenewCredentialResource(currentURL, repository.authCredentials, clock, setup),
        passwordLogin: () =>
            standardPasswordLoginResource(currentURL, repository.authCredentials, clock),
        passwordReset: () =>
            standardPasswordResetResource(currentURL, repository.authCredentials, clock),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetLoginView() {
    const currentURL = passwordResetURL()
    const repository = standardRepository()
    const clock = standardClock()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renewCredential: (setup) =>
            standardRenewCredentialResource(currentURL, repository.authCredentials, clock, setup),
        passwordLogin: () =>
            standardPasswordLoginResource(currentURL, repository.authCredentials, clock),
        passwordReset: () =>
            standardPasswordResetResource(currentURL, repository.authCredentials, clock),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}

function standardPasswordLoginResource(
    currentURL: URL,
    authCredentials: AuthCredentialRepository,
    clock: Clock
) {
    return initPasswordLoginResource(
        initLoginLocationInfo(currentURL),
        {
            link: initLoginLink,
            application: initTestApplicationAction({
                secureScriptPath: {
                    secureServerHost: standardSecureHost(),
                },
            }),
            setContinuousRenew: initTestSetContinuousRenewAction(
                {
                    setContinuousRenew: {
                        interval: { interval_millisecond: 1 },
                        delay: { delay_millisecond: 1 },
                    },
                },
                authCredentials,
                initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
                clock
            ),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        {
            login: initTestPasswordLoginAction(
                {
                    login: {
                        delay: { delay_millisecond: 1 },
                    },
                },
                initLoginSimulateRemoteAccess(simulateLogin, { wait_millisecond: 0 })
            ),
        }
    )
}
function standardPasswordResetResource(
    currentURL: URL,
    authCredentials: AuthCredentialRepository,
    clock: Clock
) {
    return initPasswordResetResource(
        initLoginLocationInfo(currentURL),
        {
            link: initLoginLink,
            application: initTestApplicationAction({
                secureScriptPath: {
                    secureServerHost: standardSecureHost(),
                },
            }),
            setContinuousRenew: initTestSetContinuousRenewAction(
                {
                    setContinuousRenew: {
                        interval: { interval_millisecond: 1 },
                        delay: { delay_millisecond: 1 },
                    },
                },
                authCredentials,
                initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
                clock
            ),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        {
            reset: initTestPasswordResetAction(
                {
                    reset: {
                        delay: { delay_millisecond: 1 },
                    },
                },
                initResetSimulateRemoteAccess(simulateReset, { wait_millisecond: 0 })
            ),
        }
    )
}
function standardPasswordResetSessionResource() {
    return initPasswordResetSessionResource(
        {
            link: initLoginLink,
            application: initTestApplicationAction({
                secureScriptPath: {
                    secureServerHost: standardSecureHost(),
                },
            }),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
            },
        },
        {
            resetSession: initTestPasswordResetSessionAction(
                {
                    startSession: {
                        delay: { delay_millisecond: 1 },
                    },
                    checkStatus: {
                        wait: { wait_millisecond: 2 },
                        limit: { limit: 5 },
                    },
                },
                {
                    startSession: initStartSessionSimulateRemoteAccess(simulateStartSession, {
                        wait_millisecond: 0,
                    }),
                    sendToken: initSendTokenSimulateRemoteAccess(simulateSendToken, {
                        wait_millisecond: 0,
                    }),
                    getStatus: initGetStatusSimulateRemoteAccess(simulateGetStatus, {
                        wait_millisecond: 0,
                    }),
                }
            ),
        }
    )
}
function standardRenewCredentialResource(
    currentURL: URL,
    authCredentials: AuthCredentialRepository,
    clock: Clock,
    setup: Setup<RenewCredentialComponent>
) {
    return initRenewCredentialResource(setup, initLoginLocationInfo(currentURL), {
        application: initTestApplicationAction({
            secureScriptPath: {
                secureServerHost: standardSecureHost(),
            },
        }),
        renew: initTestRenewAction(
            {
                renew: {
                    instantLoadExpire: { expire_millisecond: 20 * 1000 },
                    delay: { delay_millisecond: 1 },
                },
            },
            authCredentials,
            initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
            clock
        ),
        setContinuousRenew: initTestSetContinuousRenewAction(
            {
                setContinuousRenew: {
                    interval: { interval_millisecond: 1 },
                    delay: { delay_millisecond: 1 },
                },
            },
            authCredentials,
            initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
            clock
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
            ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
            apiCredential: markApiCredential({ apiRoles: ["role"] }),
            authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
        },
    }
}
function simulateRenew(): RenewRemoteAccessResult {
    return {
        success: false,
        err: { type: "invalid-ticket" },
    }
}
function simulateReset(): ResetRemoteAccessResult {
    return {
        success: true,
        value: {
            ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
            apiCredential: markApiCredential({ apiRoles: ["role"] }),
            authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
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
        authCredentials: initAuthCredentialRepository(
            initTestAuthCredentialStorage({
                ticketNonce: { set: false },
                apiCredential: { set: false },
                lastAuthAt: { set: false },
            })
        ),
    }
}

function standardClock(): Clock {
    return initStaticClock(NOW)
}

interface Handler<T> {
    (state: T): void
}
interface Setup<T> {
    (component: T): void
}
interface Terminate {
    (): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
