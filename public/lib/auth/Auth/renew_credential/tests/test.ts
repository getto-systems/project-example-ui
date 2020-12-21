import { wait } from "../../../../z_external/delayed"

import { Config, newRenewCredentialResource, Repository, Simulator } from "./core"

import { initMemoryAuthCredentialRepository } from "../../../login/renew/impl/repository/auth_credential/memory"
import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"
import { initStaticClock } from "../../../login/renew/impl/clock/simulate"

import { AuthCredentialRepository, Clock } from "../../../login/renew/infra"

import { RenewCredentialState } from "../component"

import { markApiCredential, markLoginAt, markTicketNonce } from "../../../common/credential/data"
import { markScriptPath } from "../../../common/application/data"

const STORED_TICKET_NONCE = "stored-ticket-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

const RENEWED_TICKET_NONCE = "renewed-ticket-nonce" as const
const SUCCEED_TO_RENEW_AT = new Date("2020-01-01 10:00:00")

// renew リクエストを投げるべきか、instant load していいかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
const NOW_INSTANT_LOAD_AVAILABLE = new Date("2020-01-01 09:00:10")
const NOW_INSTANT_LOAD_DISABLED = new Date("2020-01-01 09:00:30")

describe("RenewCredential", () => {
    test("instant load", (done) => {
        const { repository, resource } = instantRenewCredentialResource()

        resource.renewCredential.onStateChange(stateHandler())

        resource.renewCredential.renew()

        function stateHandler(): Post<RenewCredentialState> {
            const stack: RenewCredentialState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                        resource.renewCredential.succeedToInstantLoad()
                        break

                    case "succeed-to-set-continuous-renew":
                        expect(stack).toEqual([
                            {
                                type: "try-to-instant-load",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                            { type: "succeed-to-set-continuous-renew" },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authCredentials)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "try-to-load":
                    case "required-to-login":
                        done(new Error(state.type))
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("instant load failed", (done) => {
        const { repository, resource } = instantRenewCredentialResource()

        resource.renewCredential.onStateChange(stateHandler())

        resource.renewCredential.renew()

        function stateHandler(): Post<RenewCredentialState> {
            const stack: RenewCredentialState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                        resource.renewCredential.failedToInstantLoad()
                        break

                    case "required-to-login":
                    case "succeed-to-set-continuous-renew":
                        done(new Error(state.type))
                        break

                    case "try-to-load":
                        expect(stack).toEqual([
                            {
                                type: "try-to-instant-load",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                            { type: "try-to-renew" },
                            {
                                type: "try-to-load",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authCredentials)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("renew stored credential", (done) => {
        const { repository, resource } = standardRenewCredentialResource()

        resource.renewCredential.onStateChange(stateHandler())

        resource.renewCredential.renew()

        function stateHandler(): Post<RenewCredentialState> {
            const stack: RenewCredentialState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                    case "required-to-login":
                    case "succeed-to-set-continuous-renew":
                        done(new Error(state.type))
                        break

                    case "try-to-load":
                        expect(stack).toEqual([
                            { type: "try-to-renew" },
                            {
                                type: "try-to-load",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authCredentials)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("renew stored credential; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, resource } = waitRenewCredentialResource()

        resource.renewCredential.onStateChange(stateHandler())

        resource.renewCredential.renew()

        function stateHandler(): Post<RenewCredentialState> {
            const stack: RenewCredentialState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                    case "required-to-login":
                    case "succeed-to-set-continuous-renew":
                        done(new Error(state.type))
                        break

                    case "try-to-load":
                        expect(stack).toEqual([
                            { type: "try-to-renew" },
                            { type: "delayed-to-renew" }, // delayed event
                            {
                                type: "try-to-load",
                                scriptPath: markScriptPath("//secure.example.com/index.js"),
                            },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authCredentials)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("renew without stored credential", (done) => {
        // empty credential
        const { repository, resource } = emptyRenewCredentialResource()

        resource.renewCredential.onStateChange(stateHandler())

        resource.renewCredential.renew()

        function stateHandler(): Post<RenewCredentialState> {
            const stack: RenewCredentialState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                    case "succeed-to-set-continuous-renew":
                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "required-to-login":
                        expect(stack).toEqual([{ type: "required-to-login" }])
                        expectToEmptyLastLogin(repository.authCredentials)
                        done()
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardRenewCredentialResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock)

    return { repository, resource }
}
function instantRenewCredentialResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = instantAvailableClock()
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock)

    return { repository, resource }
}
function waitRenewCredentialResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock)

    return { repository, resource }
}
function emptyRenewCredentialResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = emptyRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock)

    return { repository, resource }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig(): Config {
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
function standardRepository(): Repository {
    return {
        authCredentials: initMemoryAuthCredentialRepository({
            stored: true,
            authCredential: {
                ticketNonce: markTicketNonce(STORED_TICKET_NONCE),
                apiCredential: markApiCredential({ apiRoles: ["role"] }),
                loginAt: markLoginAt(STORED_LOGIN_AT),
            },
        }),
    }
}
function emptyRepository(): Repository {
    return {
        authCredentials: initMemoryAuthCredentialRepository({ stored: false }),
    }
}
function standardSimulator(): Simulator {
    return {
        renew: renewSimulator({ wait_millisecond: 0 }),
    }
}
function waitSimulator(): Simulator {
    return {
        // wait for delayed timeout
        renew: renewSimulator({ wait_millisecond: 3 }),
    }
}

function renewSimulator(waitTime: WaitTime): RenewSimulator {
    let renewed = false
    return {
        renew: async () => {
            if (renewed) {
                // 最初の一回だけ renew して、あとは renew を cancel するために null を返す
                return null
            }
            renewed = true

            if (waitTime.wait_millisecond > 0) {
                await wait(waitTime, () => null)
            }

            return {
                ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
                apiCredential: markApiCredential({ apiRoles: ["role"] }),
                loginAt: markLoginAt(SUCCEED_TO_RENEW_AT),
            }
        },
    }
}

function standardClock(): Clock {
    return initStaticClock(NOW_INSTANT_LOAD_DISABLED)
}
function instantAvailableClock(): Clock {
    return initStaticClock(NOW_INSTANT_LOAD_AVAILABLE)
}

function expectToSaveRenewed(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
            lastLoginAt: markLoginAt(SUCCEED_TO_RENEW_AT),
        },
    })
}
function expectToEmptyLastLogin(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: false,
    })
}

interface Post<T> {
    (state: T): void
}

type WaitTime = { wait_millisecond: number }

function assertNever(_: never): never {
    throw new Error("NEVER")
}
