import { newStaticClock, StaticClock } from "../../../../../z_infra/clock/simulate"
import { initRenewAuthnInfoSimulate } from "../../../../sign/kernel/authnInfo/common/infra/remote/renew/simulate"

import { Clock } from "../../../../../z_infra/clock/infra"

import { RenewAuthInfoResource } from "./resource"

import { RenewAuthnInfoState } from "../../../../sign/x_Action/AuthnInfo/Renew/action"

import { markSecureScriptPath } from "../../../../sign/common/secureScriptPath/get/data"
import { markAuthAt, markAuthnNonce } from "../../../../sign/kernel/authnInfo/common/data"
import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../common/apiCredential/data"
import {
    AuthnInfoRepository,
    RenewAuthnInfoRemote,
    RenewAuthnInfoResult,
} from "../../../../sign/kernel/authnInfo/common/infra"
import { delayed } from "../../../../../z_infra/delayed/core"
import { initMemoryAuthnInfoRepository } from "../../../../sign/kernel/authnInfo/common/infra/repository/authnInfo/memory"
import { initGetSecureScriptPathLocationInfo } from "../../../../sign/common/secureScriptPath/get/impl"
import { initRenewAuthnInfoAction } from "../../../../sign/x_Action/AuthnInfo/Renew/impl"

const STORED_AUTHN_NONCE = "stored-authn-nonce" as const
const STORED_AUTH_AT = new Date("2020-01-01 09:00:00")

const RENEWED_AUTHN_NONCE = "renewed-authn-nonce" as const
const SUCCEED_TO_RENEW_AT = new Date("2020-01-01 10:00:00")

// renew リクエストを投げるべきか、instant load していいかの判定に使用する
// SUCCEED_TO_AUTH_AT と setContinuousRenew の delay との間でうまく調整する
const NOW_INSTANT_LOAD_AVAILABLE = new Date("2020-01-01 09:00:10")
const NOW_INSTANT_LOAD_DISABLED = new Date("2020-01-01 09:00:30")

// continuous renew リクエストを投げるべきかの判定に使用する
// テストが完了したら clock が返す値をこっちにする
const COMPLETED_NOW = new Date("2020-01-01 11:00:00")

describe("RenewAuthInfo", () => {
    test("instant load", (done) => {
        const { repository, clock, resource } = instantRenewCredentialResource()

        resource.renew.addStateHandler(stateHandler())

        resource.renew.request()

        function stateHandler(): Post<RenewAuthnInfoState> {
            const stack: RenewAuthnInfoState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                        resource.renew.succeedToInstantLoad()
                        break

                    case "succeed-to-start-continuous-renew":
                        clock.update(COMPLETED_NOW)
                        expect(stack).toEqual([
                            {
                                type: "try-to-instant-load",
                                scriptPath: markSecureScriptPath(
                                    "https://secure.example.com/index.js"
                                ),
                            },
                            { type: "succeed-to-start-continuous-renew" },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authnInfos)
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

        resource.renew.addStateHandler(stateHandler())

        resource.renew.request()

        function stateHandler(): Post<RenewAuthnInfoState> {
            const stack: RenewAuthnInfoState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                        resource.renew.failedToInstantLoad()
                        break

                    case "required-to-login":
                    case "succeed-to-start-continuous-renew":
                        done(new Error(state.type))
                        break

                    case "try-to-load":
                        clock.update(COMPLETED_NOW)
                        expect(stack).toEqual([
                            {
                                type: "try-to-instant-load",
                                scriptPath: markSecureScriptPath(
                                    "https://secure.example.com/index.js"
                                ),
                            },
                            { type: "try-to-renew" },
                            {
                                type: "try-to-load",
                                scriptPath: markSecureScriptPath(
                                    "https://secure.example.com/index.js"
                                ),
                            },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authnInfos)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
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

        resource.renew.addStateHandler(stateHandler())

        resource.renew.request()

        function stateHandler(): Post<RenewAuthnInfoState> {
            const stack: RenewAuthnInfoState[] = []
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
                    case "succeed-to-start-continuous-renew":
                        done(new Error(state.type))
                        break

                    case "try-to-load":
                        clock.update(COMPLETED_NOW)
                        expect(stack).toEqual([
                            { type: "try-to-renew" },
                            {
                                type: "try-to-load",
                                scriptPath: markSecureScriptPath(
                                    "https://secure.example.com/index.js"
                                ),
                            },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authnInfos)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
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

        resource.renew.addStateHandler(stateHandler())

        resource.renew.request()

        function stateHandler(): Post<RenewAuthnInfoState> {
            const stack: RenewAuthnInfoState[] = []
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
                    case "succeed-to-start-continuous-renew":
                        done(new Error(state.type))
                        break

                    case "try-to-load":
                        clock.update(COMPLETED_NOW)
                        expect(stack).toEqual([
                            { type: "try-to-renew" },
                            { type: "delayed-to-renew" }, // delayed event
                            {
                                type: "try-to-load",
                                scriptPath: markSecureScriptPath(
                                    "https://secure.example.com/index.js"
                                ),
                            },
                        ])
                        setTimeout(() => {
                            expectToSaveRenewed(repository.authnInfos)
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
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

        resource.renew.addStateHandler(stateHandler())

        resource.renew.request()

        function stateHandler(): Post<RenewAuthnInfoState> {
            const stack: RenewAuthnInfoState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                    case "succeed-to-start-continuous-renew":
                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "required-to-login":
                        expect(stack).toEqual([{ type: "required-to-login" }])
                        expectToEmptyLastAuth(repository.authnInfos)
                        done()
                        break

                    case "failed-to-renew":
                    case "storage-error":
                    case "load-error":
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

        resource.renew.addStateHandler(stateHandler())

        resource.renew.loadError({ type: "infra-error", err: "load error" })

        function stateHandler(): Post<RenewAuthnInfoState> {
            const stack: RenewAuthnInfoState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                    case "succeed-to-start-continuous-renew":
                    case "required-to-login":
                    case "try-to-load":
                        done(new Error(state.type))
                        break

                    case "failed-to-renew":
                    case "storage-error":
                        done(new Error(state.type))
                        break

                    case "load-error":
                        expect(stack).toEqual([
                            {
                                type: "load-error",
                                err: { type: "infra-error", err: "load error" },
                            },
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
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newTestRenewCredentialResource(
        currentURL,
        repository,
        simulator,
        clock
    )

    return { repository, clock, resource }
}
function instantRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = instantAvailableClock()
    const resource = newTestRenewCredentialResource(
        currentURL,
        repository,
        simulator,
        clock
    )

    return { repository, clock, resource }
}
function waitRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clock = standardClock()
    const resource = newTestRenewCredentialResource(
        currentURL,
        repository,
        simulator,
        clock
    )

    return { repository, clock, resource }
}
function emptyRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = emptyRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newTestRenewCredentialResource(
        currentURL,
        repository,
        simulator,
        clock
    )

    return { repository, resource }
}

type RenewCredentialTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
}>
type RenewCredentialTestRemoteAccess = Readonly<{
    renew: RenewAuthnInfoRemote
}>

function newTestRenewCredentialResource(
    currentURL: URL,
    repository: RenewCredentialTestRepository,
    remote: RenewCredentialTestRemoteAccess,
    clock: Clock
): RenewAuthInfoResource {
    const config = standardConfig()
    return {
        renew: initRenewAuthnInfoAction(
            {
                renew: {
                    ...repository,
                    ...remote,
                    config: config.renew,
                    delayed,
                    clock,
                },
                startContinuousRenew: {
                    ...repository,
                    ...remote,
                    config: config.continuousRenew,
                    clock,
                },
                getSecureScriptPath: {
                    config: config.location,
                },
            },
            initGetSecureScriptPathLocationInfo(currentURL)
        ),
    }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig() {
    return {
        location: {
            secureServerHost: "secure.example.com",
        },
        renew: {
            instantLoadExpire: { expire_millisecond: 20 * 1000 },
            delay: { delay_millisecond: 1 },
        },
        continuousRenew: {
            interval: { interval_millisecond: 1 },
            delay: { delay_millisecond: 1 },
        },
    }
}

function standardRepository(): RenewCredentialTestRepository {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        }),
        authnInfos: initMemoryAuthnInfoRepository({
            authnNonce: { set: true, value: markAuthnNonce(STORED_AUTHN_NONCE) },
            lastAuthAt: { set: true, value: markAuthAt(STORED_AUTH_AT) },
        }),
    }
}
function emptyRepository(): RenewCredentialTestRepository {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: false,
        }),
        authnInfos: initMemoryAuthnInfoRepository({
            authnNonce: { set: false },
            lastAuthAt: { set: false },
        }),
    }
}
function standardSimulator(): RenewCredentialTestRemoteAccess {
    return {
        renew: renewRemoteAccess({ wait_millisecond: 0 }),
    }
}
function waitSimulator(): RenewCredentialTestRemoteAccess {
    return {
        // wait for delayed timeout
        renew: renewRemoteAccess({ wait_millisecond: 3 }),
    }
}

function renewRemoteAccess(waitTime: WaitTime): RenewAuthnInfoRemote {
    let renewedCount = 0
    return initRenewAuthnInfoSimulate((): RenewAuthnInfoResult => {
        // 初回 renew と continuous renew 一回目の 2回だけ正しく返す
        // 以降は invalid-ticket でタイマーを止める
        if (renewedCount > 1) {
            return { success: false, err: { type: "invalid-ticket" } }
        }
        renewedCount++

        return {
            success: true,
            value: {
                auth: {
                    authnNonce: markAuthnNonce(RENEWED_AUTHN_NONCE),
                    authAt: markAuthAt(SUCCEED_TO_RENEW_AT),
                },
                api: {
                    apiNonce: markApiNonce("api-nonce"),
                    apiRoles: markApiRoles(["role"]),
                },
            },
        }
    }, waitTime)
}

function standardClock(): StaticClock {
    return newStaticClock(NOW_INSTANT_LOAD_DISABLED)
}
function instantAvailableClock(): StaticClock {
    return newStaticClock(NOW_INSTANT_LOAD_AVAILABLE)
}

function expectToSaveRenewed(authnInfos: AuthnInfoRepository) {
    expect(authnInfos.load()).toEqual({
        success: true,
        found: true,
        lastAuth: {
            authnNonce: markAuthnNonce(RENEWED_AUTHN_NONCE),
            lastAuthAt: markAuthAt(SUCCEED_TO_RENEW_AT),
        },
    })
}
function expectToEmptyLastAuth(authnInfos: AuthnInfoRepository) {
    expect(authnInfos.load()).toEqual({
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
