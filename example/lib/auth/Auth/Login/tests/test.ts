import { initAuthCredentialTestStorage, initLoginViewCollector } from "./core"

import {
    PasswordLoginConfig,
    newPasswordLoginResource,
    PasswordLoginRepository,
    PasswordLoginSimulator,
} from "../../passwordLogin/tests/core"
import {
    PasswordResetConfig,
    newPasswordResetResource,
    PasswordResetRepository,
    PasswordResetSimulator,
} from "../../passwordReset/tests/core"
import {
    PasswordResetSessionConfig,
    newPasswordResetSessionResource,
    PasswordResetSessionSimulator,
} from "../../passwordResetSession/tests/core"
import {
    RenewCredentialConfig,
    newRenewCredentialResource,
    RenewCredentialRepository,
    RenewCredentialSimulator,
} from "../../renewCredential/tests/core"

import { RenewSimulator } from "../../../login/renew/impl/remote/renew/simulate"
import { initStaticClock } from "../../../../z_infra/clock/simulate"
import { SendTokenState } from "../../../profile/passwordReset/impl/remote/session/simulate"

import { initAuthCredentialRepository } from "../../../login/renew/impl/repository/authCredential"

import { Clock } from "../../../../z_infra/clock/infra"

import {
    AuthCredential,
    markApiCredential,
    markAuthAt,
    markTicketNonce,
} from "../../../common/credential/data"
import { LoginFields } from "../../../login/passwordLogin/data"
import {
    Destination,
    markSessionID,
    ResetFields,
    ResetToken,
    SessionID,
    StartSessionFields,
} from "../../../profile/passwordReset/data"

import { View } from "../impl/core"
import { RenewCredentialComponent } from "../../renewCredential/component"
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
    const collector = initLoginViewCollector(currentURL)
    const view = new View(collector, {
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
    const collector = initLoginViewCollector(currentURL)
    const view = new View(collector, {
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
    const collector = initLoginViewCollector(currentURL)
    const view = new View(collector, {
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
    const simulator = standardPasswordLoginSimulator()
    return newPasswordLoginResource(currentURL, config, repository, simulator, clock)
}
function standardPasswordResetResource(currentURL: URL, repository: Repository, clock: Clock) {
    const config = standardPasswordResetConfig()
    const simulator = standardPasswordResetSimulator()
    return newPasswordResetResource(currentURL, config, repository, simulator, clock)
}
function standardPasswordResetSessionResource() {
    const config = standardPasswordResetSessionConfig()
    const simulator = standardPasswordResetSessionSimulator()
    return newPasswordResetSessionResource(config, simulator)
}
function standardRenewCredentialResource(
    currentURL: URL,
    repository: Repository,
    clock: Clock,
    setup: Setup<RenewCredentialComponent>
) {
    const config = standardRenewCredentialConfig()
    const simulator = standardRenewCredentialSimulator()
    return newRenewCredentialResource(currentURL, config, repository, simulator, clock, setup)
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

function standardPasswordLoginSimulator(): PasswordLoginSimulator {
    return {
        login: {
            login: async (fields) => {
                return simulateLogin(fields)
            },
        },
        renew: renewSimulator(),
    }
}
function standardPasswordResetSimulator(): PasswordResetSimulator {
    return {
        reset: {
            reset: async (resetToken, fields) => {
                return simulateReset(resetToken, fields)
            },
        },
        renew: renewSimulator(),
    }
}
function standardPasswordResetSessionSimulator(): PasswordResetSessionSimulator {
    return {
        session: {
            startSession: async (fields) => {
                return simulateStartSession(fields)
            },
            sendToken: async (post) => {
                return simulateSendToken(post)
            },
            getDestination: async (sessionID) => {
                return simulateGetDestination(sessionID)
            },
        },
    }
}
function standardRenewCredentialSimulator(): RenewCredentialSimulator {
    return {
        renew: renewSimulator(),
    }
}

function simulateLogin(_fields: LoginFields): AuthCredential {
    return {
        ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
        apiCredential: markApiCredential({ apiRoles: ["role"] }),
        authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
    }
}
function renewSimulator(): RenewSimulator {
    return {
        renew: async () => {
            return null
        },
    }
}
function simulateReset(_resetToken: ResetToken, _fields: ResetFields): AuthCredential {
    return {
        ticketNonce: markTicketNonce(AUTHORIZED_TICKET_NONCE),
        apiCredential: markApiCredential({ apiRoles: ["role"] }),
        authAt: markAuthAt(SUCCEED_TO_LOGIN_AT),
    }
}

function simulateStartSession(_fields: StartSessionFields): SessionID {
    return markSessionID(SESSION_ID)
}
function simulateSendToken(post: Handler<SendTokenState>): true {
    setTimeout(() => {
        post({ state: "waiting" })
    }, 0)
    setTimeout(() => {
        post({ state: "sending" })
    }, 2)
    setTimeout(() => {
        post({ state: "success" })
    }, 4)
    return true
}
function simulateGetDestination(_sessionID: SessionID): Destination {
    return { type: "log" }
}

function standardRepository(): Repository {
    return {
        authCredentials: initAuthCredentialRepository(
            initAuthCredentialTestStorage({
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
