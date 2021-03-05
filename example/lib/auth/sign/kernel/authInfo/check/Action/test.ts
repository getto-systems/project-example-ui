import {
    ClockPubSub,
    ClockSubscriber,
    initStaticClock,
    staticClockPubSub,
} from "../../../../../../z_vendor/getto-application/infra/clock/simulate"

import { Clock } from "../../../../../../z_vendor/getto-application/infra/clock/infra"

import { CheckAuthInfoResource, CheckAuthInfoResourceState } from "./action"

import { initGetScriptPathLocationDetecter } from "../../../../common/secure/getScriptPath/impl/testHelper"
import { LastAuthRepositoryPod, LastAuthRepositoryValue, RenewRemotePod } from "../../kernel/infra"
import { toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"
import { initSyncActionTestRunner } from "../../../../../../z_vendor/getto-application/action/testHelper"
import { initMockCoreAction } from "./Core/mock"
import { initMemoryDB } from "../../../../../../z_vendor/getto-application/infra/repository/memory"
import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../../../common/authz/infra"
import { wrapRepository } from "../../../../../../z_vendor/getto-application/infra/repository/helper"
import { lastAuthRepositoryConverter } from "../../kernel/convert"
import { initRemoteSimulator } from "../../../../../../z_vendor/getto-application/infra/remote/simulate"

const STORED_AUTHN_NONCE = "stored-authn-nonce" as const
const STORED_AUTH_AT = new Date("2020-01-01 09:00:00").toISOString()

const RENEWED_AUTHN_NONCE = "renewed-authn-nonce" as const
const SUCCEED_TO_RENEW_AT = [
    new Date("2020-01-01 10:00:00"),
    new Date("2020-01-01 10:00:01"),
    new Date("2020-01-01 11:00:00"),
]

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
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<CheckAuthInfoResourceState> {
            const stack: CheckAuthInfoResourceState[] = []
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
                                scriptPath: {
                                    valid: true,
                                    value: "https://secure.example.com/index.js",
                                },
                            },
                            { type: "succeed-to-start-continuous-renew" },
                        ])
                        setTimeout(() => {
                            expect(lastAuth.get()).toEqual({
                                success: true,
                                found: true,
                                value: {
                                    nonce: RENEWED_AUTHN_NONCE,
                                    lastAuthAt: SUCCEED_TO_RENEW_AT[0],
                                },
                            })
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "try-to-load":
                    case "required-to-login":
                        done(new Error(state.type))
                        break

                    case "failed-to-renew":
                    case "repository-error":
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
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<CheckAuthInfoResourceState> {
            const stack: CheckAuthInfoResourceState[] = []
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
                                scriptPath: {
                                    valid: true,
                                    value: "https://secure.example.com/index.js",
                                },
                            },
                            { type: "try-to-renew" },
                            {
                                type: "try-to-load",
                                scriptPath: {
                                    valid: true,
                                    value: "https://secure.example.com/index.js",
                                },
                            },
                        ])
                        setTimeout(() => {
                            expect(lastAuth.get()).toEqual({
                                success: true,
                                found: true,
                                value: {
                                    nonce: RENEWED_AUTHN_NONCE,
                                    lastAuthAt: SUCCEED_TO_RENEW_AT[1],
                                },
                            })
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "repository-error":
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
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<CheckAuthInfoResourceState> {
            const stack: CheckAuthInfoResourceState[] = []
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
                                scriptPath: {
                                    valid: true,
                                    value: "https://secure.example.com/index.js",
                                },
                            },
                        ])
                        setTimeout(() => {
                            expect(lastAuth.get()).toEqual({
                                success: true,
                                found: true,
                                value: {
                                    nonce: RENEWED_AUTHN_NONCE,
                                    lastAuthAt: SUCCEED_TO_RENEW_AT[1],
                                },
                            })
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "repository-error":
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
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<CheckAuthInfoResourceState> {
            const stack: CheckAuthInfoResourceState[] = []
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
                                scriptPath: {
                                    valid: true,
                                    value: "https://secure.example.com/index.js",
                                },
                            },
                        ])
                        setTimeout(() => {
                            expect(lastAuth.get()).toEqual({
                                success: true,
                                found: true,
                                value: {
                                    nonce: RENEWED_AUTHN_NONCE,
                                    lastAuthAt: SUCCEED_TO_RENEW_AT[0],
                                },
                            })
                            done()
                        }, 1) // after setContinuousRenew interval and delay
                        break

                    case "failed-to-renew":
                    case "repository-error":
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
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        resource.core.subscriber.subscribe(stateHandler())

        resource.core.ignite()

        function stateHandler(): Post<CheckAuthInfoResourceState> {
            const stack: CheckAuthInfoResourceState[] = []
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
                        expect(lastAuth.get()).toEqual({
                            success: true,
                            found: false,
                        })
                        done()
                        break

                    case "failed-to-renew":
                    case "repository-error":
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

        function stateHandler(): Post<CheckAuthInfoResourceState> {
            const stack: CheckAuthInfoResourceState[] = []
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
                    case "repository-error":
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
    const clockPubSub = staticClockPubSub()
    const simulator = standardSimulator(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function instantRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = standardSimulator(clockPubSub)
    const clock = instantAvailableClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function waitRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = waitSimulator(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function emptyRenewCredentialResource() {
    const currentURL = standardURL()
    const repository = emptyRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = standardSimulator(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newTestRenewAuthnInfoResource(currentURL, repository, simulator, clock)

    return { repository, resource }
}

type RenewCredentialTestRepository = Readonly<{
    authz: AuthzRepositoryPod
    lastAuth: LastAuthRepositoryPod
}>
type RenewCredentialTestRemoteAccess = Readonly<{
    renew: RenewRemotePod
}>

function newTestRenewAuthnInfoResource(
    currentURL: URL,
    repository: RenewCredentialTestRepository,
    remote: RenewCredentialTestRemoteAccess,
    clock: Clock,
): CheckAuthInfoResource {
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
                initGetScriptPathLocationDetecter(currentURL),
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
            secureServerURL: "https://secure.example.com",
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
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({
        nonce: "api-nonce",
        roles: ["role"],
    })

    const lastAuth = initMemoryDB<LastAuthRepositoryValue>()
    lastAuth.set({
        nonce: STORED_AUTHN_NONCE,
        lastAuthAt: STORED_AUTH_AT,
    })

    return {
        authz: <AuthzRepositoryPod>wrapRepository(authz),
        lastAuth: <LastAuthRepositoryPod>wrapRepository(lastAuth),
    }
}
function emptyRepository(): RenewCredentialTestRepository {
    return {
        authz: wrapRepository(initMemoryDB<AuthzRepositoryValue>()),
        lastAuth: wrapRepository(initMemoryDB<LastAuthRepositoryValue>()),
    }
}
function standardSimulator(clock: ClockPubSub): RenewCredentialTestRemoteAccess {
    return {
        renew: renewRemoteAccess(clock, { wait_millisecond: 0 }),
    }
}
function waitSimulator(clock: ClockPubSub): RenewCredentialTestRemoteAccess {
    return {
        // wait for delayed timeout
        renew: renewRemoteAccess(clock, { wait_millisecond: 3 }),
    }
}

function renewRemoteAccess(clock: ClockPubSub, waitTime: WaitTime): RenewRemotePod {
    let renewedCount = 0
    return initRemoteSimulator(() => {
        // 初回 renew と continuous renew 一回目の 2回だけ正しく返す
        // 以降は invalid-ticket でタイマーを止める
        if (renewedCount > 1) {
            return { success: false, err: { type: "invalid-ticket" } }
        }

        // 現在時刻と、直後の時刻を動かす
        const now = SUCCEED_TO_RENEW_AT[renewedCount]
        const nextNow = SUCCEED_TO_RENEW_AT[renewedCount + 1]
        clock.update(now)
        setTimeout(() => clock.update(nextNow))

        renewedCount++
        return {
            success: true,
            value: {
                authn: {
                    nonce: RENEWED_AUTHN_NONCE,
                },
                authz: {
                    nonce: "api-nonce",
                    roles: ["role"],
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

interface Post<T> {
    (state: T): void
}

type WaitTime = { wait_millisecond: number }

function assertNever(_: never): never {
    throw new Error("NEVER")
}
