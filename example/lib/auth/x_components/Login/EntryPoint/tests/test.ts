import { initTestAuthCredentialStorage, initLoginViewLocationInfo } from "./core"

import {
    PasswordLoginConfig,
    newTestPasswordLoginResource,
    PasswordLoginRepository,
    PasswordLoginRemoteAccess,
} from "../../passwordLogin/tests/core"
import {
    PasswordResetConfig,
    newTestPasswordResetResource,
    PasswordResetRepository,
    PasswordResetRemoteAccess,
} from "../../passwordReset/tests/core"
import {
    PasswordResetSessionConfig,
    newTestPasswordResetSessionResource,
    PasswordResetSessionRemoteAccess,
} from "../../passwordResetSession/tests/core"
import {
    RenewCredentialConfig,
    newTestRenewCredentialResource,
    RenewCredentialRepository,
    RenewCredentialRemoteAccess,
} from "../../renewCredential/tests/core"

import { initStaticClock } from "../../../../../z_infra/clock/simulate"
import { initLoginSimulateRemoteAccess } from "../../../../login/passwordLogin/impl/remote/login/simulate"
import { initRenewSimulateRemoteAccess } from "../../../../login/credentialStore/impl/remote/renew/simulate"
import { initResetSimulateRemoteAccess } from "../../../../profile/passwordReset/impl/remote/reset/simulate"
import {
    initGetStatusSimulateRemoteAccess,
    initSendTokenSimulateRemoteAccess,
    initStartSessionSimulateRemoteAccess,
} from "../../../../profile/passwordReset/impl/remote/session/simulate"

import { initAuthCredentialRepository } from "../../../../login/credentialStore/impl/repository/authCredential"

import { Clock } from "../../../../../z_infra/clock/infra"
import { LoginRemoteAccessResult } from "../../../../login/passwordLogin/infra"
import { RenewRemoteAccessResult } from "../../../../login/credentialStore/infra"
import {
    GetStatusRemoteAccessResult,
    ResetRemoteAccessResult,
    SendTokenRemoteAccessResult,
    StartSessionRemoteAccessResult,
} from "../../../../profile/passwordReset/infra"

import { RenewCredentialComponent } from "../../renewCredential/component"

import { markApiCredential, markAuthAt, markTicketNonce } from "../../../../common/credential/data"
import { markSessionID } from "../../../../profile/passwordReset/data"

import { View } from "../impl/core"
import { LoginState } from "../entryPoint"

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
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        state.resource.renewCredential.renew()
                        break

                    case "password-login":
                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-login" })
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
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        state.resource.renewCredential.renew()
                        break

                    case "password-reset-session":
                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-session" })
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
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        state.resource.renewCredential.renew()
                        break

                    case "password-reset":
                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset" })
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

type Repository = PasswordLoginRepository & PasswordResetRepository & RenewCredentialRepository

function standardLoginView() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clock = standardClock()
    const locationInfo = initLoginViewLocationInfo(currentURL)
    const view = new View(locationInfo, {
        renewCredential: (setup) =>
            standardRenewCredentialResource(currentURL, repository, clock, setup),
        passwordLogin: () => standardPasswordLoginResource(currentURL, repository, clock),
        passwordReset: () => standardPasswordResetResource(currentURL, repository, clock),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetSessionLoginView() {
    const currentURL = passwordResetSessionURL()
    const repository = standardRepository()
    const clock = standardClock()
    const locationInfo = initLoginViewLocationInfo(currentURL)
    const view = new View(locationInfo, {
        renewCredential: (setup) =>
            standardRenewCredentialResource(currentURL, repository, clock, setup),
        passwordLogin: () => standardPasswordLoginResource(currentURL, repository, clock),
        passwordReset: () => standardPasswordResetResource(currentURL, repository, clock),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}
function passwordResetLoginView() {
    const currentURL = passwordResetURL()
    const repository = standardRepository()
    const clock = standardClock()
    const locationInfo = initLoginViewLocationInfo(currentURL)
    const view = new View(locationInfo, {
        renewCredential: (setup) =>
            standardRenewCredentialResource(currentURL, repository, clock, setup),
        passwordLogin: () => standardPasswordLoginResource(currentURL, repository, clock),
        passwordReset: () => standardPasswordResetResource(currentURL, repository, clock),
        passwordResetSession: () => standardPasswordResetSessionResource(),
    })

    return { view }
}

function standardPasswordLoginResource(currentURL: URL, repository: Repository, clock: Clock) {
    const config = standardPasswordLoginConfig()
    const simulator = standardPasswordLoginRemoteAccess()
    return newTestPasswordLoginResource(currentURL, config, repository, simulator, clock)
}
function standardPasswordResetResource(currentURL: URL, repository: Repository, clock: Clock) {
    const config = standardPasswordResetConfig()
    const simulator = standardPasswordResetRemoteAccess()
    return newTestPasswordResetResource(currentURL, config, repository, simulator, clock)
}
function standardPasswordResetSessionResource() {
    const config = standardPasswordResetSessionConfig()
    const simulator = standardPasswordResetSessionRemoteAccess()
    return newTestPasswordResetSessionResource(config, simulator)
}
function standardRenewCredentialResource(
    currentURL: URL,
    repository: Repository,
    clock: Clock,
    setup: Setup<RenewCredentialComponent>
) {
    const config = standardRenewCredentialConfig()
    const simulator = standardRenewCredentialSimulator()
    return newTestRenewCredentialResource(currentURL, config, repository, simulator, clock, setup)
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

function standardPasswordLoginConfig(): PasswordLoginConfig {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        passwordLogin: {
            login: {
                delay: { delay_millisecond: 1 },
            },
        },
        setContinuousRenew: {
            setContinuousRenew: {
                interval: { interval_millisecond: 1 },
                delay: { delay_millisecond: 1 },
            },
        },
    }
}
function standardPasswordResetConfig(): PasswordResetConfig {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        passwordReset: {
            reset: {
                delay: { delay_millisecond: 1 },
            },
        },
        setContinuousRenew: {
            setContinuousRenew: {
                interval: { interval_millisecond: 1 },
                delay: { delay_millisecond: 1 },
            },
        },
    }
}
function standardPasswordResetSessionConfig(): PasswordResetSessionConfig {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        passwordResetSession: {
            startSession: {
                delay: { delay_millisecond: 1 },
            },
            checkStatus: {
                wait: { wait_millisecond: 2 },
                limit: { limit: 5 },
            },
        },
    }
}
function standardRenewCredentialConfig(): RenewCredentialConfig {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        renew: {
            renew: {
                instantLoadExpire: { expire_millisecond: 20 * 1000 },
                delay: { delay_millisecond: 1 },
            },
        },
        setContinuousRenew: {
            setContinuousRenew: {
                interval: { interval_millisecond: 1 },
                delay: { delay_millisecond: 1 },
            },
        },
    }
}

function standardPasswordLoginRemoteAccess(): PasswordLoginRemoteAccess {
    return {
        login: initLoginSimulateRemoteAccess(simulateLogin, { wait_millisecond: 0 }),
        renew: initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
    }
}
function standardPasswordResetRemoteAccess(): PasswordResetRemoteAccess {
    return {
        reset: initResetSimulateRemoteAccess(simulateReset, { wait_millisecond: 0 }),
        renew: initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
    }
}
function standardPasswordResetSessionRemoteAccess(): PasswordResetSessionRemoteAccess {
    return {
        startSession: initStartSessionSimulateRemoteAccess(simulateStartSession, {
            wait_millisecond: 0,
        }),
        sendToken: initSendTokenSimulateRemoteAccess(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: initGetStatusSimulateRemoteAccess(simulateGetStatus, { wait_millisecond: 0 }),
    }
}
function standardRenewCredentialSimulator(): RenewCredentialRemoteAccess {
    return {
        renew: initRenewSimulateRemoteAccess(simulateRenew, { wait_millisecond: 0 }),
    }
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

function standardRepository(): Repository {
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

function assertNever(_: never): never {
    throw new Error("NEVER")
}
