import { wait } from "../../../../z_external/delayed"

import {
    RenewCredentialConfig,
    newRenewCredentialResource,
    RenewCredentialRepository,
    RenewCredentialSimulator,
} from "./core"

import { initMemoryAuthCredentialRepository } from "../../../login/renew/impl/repository/authCredential/memory"
import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"
import { initStaticClock, StaticClock } from "../../../../z_infra/clock/simulate"

import { AuthCredentialRepository } from "../../../login/renew/infra"

import { RenewCredentialState } from "../component"

import { markApiCredential, markAuthAt, markTicketNonce } from "../../../common/credential/data"
import { markScriptPath } from "../../../common/application/data"

const STORED_TICKET_NONCE = "stored-ticket-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

const RENEWED_TICKET_NONCE = "renewed-ticket-nonce" as const
const SUCCEED_TO_RENEW_AT = new Date("2020-01-01 10:00:00")

// renew リクエストを投げるべきか、instant load していいかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
const NOW_INSTANT_LOAD_AVAILABLE = new Date("2020-01-01 09:00:10")
const NOW_INSTANT_LOAD_DISABLED = new Date("2020-01-01 09:00:30")

// continuous renew リクエストを投げるべきかの判定に使用する
// テストが完了したら clock が返す値をこっちにする
const COMPLETED_NOW = new Date("2020-01-01 11:00:00")

describe("RenewCredential", () => {
    test("instant load", (done) => {
        const { repository, clock, resource } = instantRenewCredentialResource()

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
                        clock.update(COMPLETED_NOW)
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
        const { repository, clock, resource } = instantRenewCredentialResource()

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
                        clock.update(COMPLETED_NOW)
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
        const { repository, clock, resource } = standardRenewCredentialResource()

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
                        clock.update(COMPLETED_NOW)
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
        const { repository, clock, resource } = waitRenewCredentialResource()

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
                        clock.update(COMPLETED_NOW)
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

    test("load error", (done) => {
        const { resource } = standardRenewCredentialResource()

        resource.renewCredential.onStateChange(stateHandler())

        resource.renewCredential.loadError({ type: "infra-error", err: "load error" })

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
                    case "required-to-login":
                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "error":
                        done(new Error(state.type))
                        break

                    case "load-error":
                        expect(stack).toEqual([
                            { type: "load-error", err: { type: "infra-error", err: "load error" } },
                        ])
                        done()
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
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock, () => {
        // ここでは特に何もしない
    })

    return { repository, clock, resource }
}
function instantRenewCredentialResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = instantAvailableClock()
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock, () => {
        // ここでは特に何もしない
    })

    return { repository, clock, resource }
}
function waitRenewCredentialResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock, () => {
        // ここでは特に何もしない
    })

    return { repository, clock, resource }
}
function emptyRenewCredentialResource() {
    const currentURL = standardURL()
    const config = standardConfig()
    const repository = emptyRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newRenewCredentialResource(currentURL, config, repository, simulator, clock, () => {
        // ここでは特に何もしない
    })

    return { repository, resource }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig(): RenewCredentialConfig {
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
function standardRepository(): RenewCredentialRepository {
    return {
        authCredentials: initMemoryAuthCredentialRepository({
            stored: true,
            authCredential: {
                ticketNonce: markTicketNonce(STORED_TICKET_NONCE),
                apiCredential: markApiCredential({ apiRoles: ["role"] }),
                authAt: markAuthAt(STORED_LOGIN_AT),
            },
        }),
    }
}
function emptyRepository(): RenewCredentialRepository {
    return {
        authCredentials: initMemoryAuthCredentialRepository({ stored: false }),
    }
}
function standardSimulator(): RenewCredentialSimulator {
    return {
        renew: renewSimulator({ wait_millisecond: 0 }),
    }
}
function waitSimulator(): RenewCredentialSimulator {
    return {
        // wait for delayed timeout
        renew: renewSimulator({ wait_millisecond: 3 }),
    }
}

function renewSimulator(waitTime: WaitTime): RenewSimulator {
    let renewedCount = 0
    return {
        renew: async () => {
            if (renewedCount > 1) {
                // 初回 renew と continuous renew 一回目の 2回だけ
                // renew して、あとは renew を cancel するために null を返す
                return null
            }
            renewedCount++

            if (waitTime.wait_millisecond > 0) {
                await wait(waitTime, () => null)
            }

            return {
                ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
                apiCredential: markApiCredential({ apiRoles: ["role"] }),
                authAt: markAuthAt(SUCCEED_TO_RENEW_AT),
            }
        },
    }
}

function standardClock(): StaticClock {
    return initStaticClock(NOW_INSTANT_LOAD_DISABLED)
}
function instantAvailableClock(): StaticClock {
    return initStaticClock(NOW_INSTANT_LOAD_AVAILABLE)
}

function expectToSaveRenewed(authCredentials: AuthCredentialRepository) {
    expect(authCredentials.findLastLogin()).toEqual({
        success: true,
        found: true,
        lastLogin: {
            ticketNonce: markTicketNonce(RENEWED_TICKET_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_RENEW_AT),
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
