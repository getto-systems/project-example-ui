import {
    ClockSubscriber,
    initStaticClock,
    staticClockPubSub,
} from "../../../../../../../z_vendor/getto-application/infra/clock/simulate"
import { initRenewSimulate } from "../../../kernel/infra/remote/renew/simulate"

import { Clock } from "../../../../../../../z_vendor/getto-application/infra/clock/infra"

import { RenewAuthnInfoResource, RenewAuthnInfoResourceState } from "./action"

import { markSecureScriptPath } from "../../../../../common/secureScriptPath/get/data"
import { markAuthAt, markAuthnNonce } from "../../../kernel/data"
import { ApiCredentialRepository } from "../../../../../../../common/apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../../../common/apiCredential/data"
import { AuthnInfoRepository, RenewRemote, RenewResult } from "../../../kernel/infra"
import { initMemoryAuthnInfoRepository } from "../../../kernel/infra/repository/authnInfo/memory"
import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"
import { toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"
import { initSyncActionTestRunner } from "../../../../../../../z_vendor/getto-application/action/testHelper"
import { initMockCoreAction } from "./Core/mock"

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

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<RenewAuthnInfoResourceState> {
            const stack: RenewAuthnInfoResourceState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                        resource.core.succeedToInstantLoad()
                        break

                    case "succeed-to-start-continuous-renew":
                        clock.update(COMPLETED_NOW)
                        expect(stack).toEqual([
                            {
                                type: "try-to-instant-load",
                                scriptPath: markSecureScriptPath(
                                    "https://secure.example.com/index.js",
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

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<RenewAuthnInfoResourceState> {
            const stack: RenewAuthnInfoResourceState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-renew":
                    case "try-to-renew":
                    case "delayed-to-renew":
                        // work in progress...
                        break

                    case "try-to-instant-load":
                        resource.core.failedToInstantLoad()
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
                                    "https://secure.example.com/index.js",
                                ),
                            },
                            { type: "try-to-renew" },
                            {
                                type: "try-to-load",
                                scriptPath: markSecureScriptPath(
                                    "https://secure.example.com/index.js",
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

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<RenewAuthnInfoResourceState> {
            const stack: RenewAuthnInfoResourceState[] = []
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
                                    "https://secure.example.com/index.js",
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

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<RenewAuthnInfoResourceState> {
            const stack: RenewAuthnInfoResourceState[] = []
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
                                    "https://secure.example.com/index.js",
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

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<RenewAuthnInfoResourceState> {
            const stack: RenewAuthnInfoResourceState[] = []
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

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.loadError({ type: "infra-error", err: "load error" })

        function stateHandler(): Post<RenewAuthnInfoResourceState> {
            const stack: RenewAuthnInfoResourceState[] = []
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

    test("terminate", (done) => {
        const entryPoint = toEntryPoint(initMockCoreAction())

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
                    entryPoint.resource.core.ignite()
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        entryPoint.resource.core.subscriber.subscribe(runner(done))
    })
})

function standardRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clockPubSub = staticClockPubSub()
    const clock = standardClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function instantRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clockPubSub = staticClockPubSub()
    const clock = instantAvailableClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function waitRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const simulator = waitSimulator()
    const clockPubSub = staticClockPubSub()
    const clock = standardClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function emptyRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = emptyRepository()
    const simulator = standardSimulator()
    const clockPubSub = staticClockPubSub()
    const clock = standardClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, resource }
}

type RenewCredentialTestRepository = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
}>
type RenewCredentialTestRemoteAccess = Readonly<{
    renew: RenewRemote
}>

function newTestRenewAuthnInfoResource(
    currentURL: URL,
    repository: RenewCredentialTestRepository,
    remote: RenewCredentialTestRemoteAccess,
    clock: Clock,
): RenewAuthnInfoResource {
    const config = standardConfig()
    return toEntryPoint(
        initCoreAction(
            initCoreMaterial(
                {
                    renew: {
                        ...repository,
                        ...remote,
                        config: config.renew,
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
                newGetSecureScriptPathLocationInfo(currentURL),
            ),
        ),
    ).resource
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

function renewRemoteAccess(waitTime: WaitTime): RenewRemote {
    let renewedCount = 0
    return initRenewSimulate((): RenewResult => {
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

function standardClock(subscriber: ClockSubscriber): Clock {
    return initStaticClock(NOW_INSTANT_LOAD_DISABLED, subscriber)
}
function instantAvailableClock(subscriber: ClockSubscriber): Clock {
    return initStaticClock(NOW_INSTANT_LOAD_AVAILABLE, subscriber)
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
