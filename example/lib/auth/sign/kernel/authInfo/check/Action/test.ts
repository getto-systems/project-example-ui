import {
    ClockPubSub,
    ClockSubscriber,
    initStaticClock,
    staticClockPubSub,
} from "../../../../../../z_vendor/getto-application/infra/clock/simulate"

import { Clock } from "../../../../../../z_vendor/getto-application/infra/clock/infra"

import { CheckAuthInfoResource, CheckAuthInfoResourceState } from "./action"

import { initGetScriptPathLocationDetecter } from "../../../../common/secure/getScriptPath/impl/testHelper"
import {
    LastAuthRepositoryPod,
    LastAuthRepositoryValue,
    RenewAuthInfoRemotePod,
} from "../../kernel/infra"
import { toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"
import {
    initAsyncActionTestRunner,
    initSyncActionTestRunner,
} from "../../../../../../z_vendor/getto-application/action/testHelper"
import { initMockCoreAction } from "./Core/mock"
import { initMemoryDB } from "../../../../../../z_vendor/getto-application/infra/repository/memory"
import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../../../common/authz/infra"
import { wrapRepository } from "../../../../../../z_vendor/getto-application/infra/repository/helper"
import { lastAuthRepositoryConverter } from "../../kernel/convert"
import { initRemoteSimulator } from "../../../../../../z_vendor/getto-application/infra/remote/simulate"
import { startContinuousRenewEventHasDone } from "../../common/startContinuousRenew/impl/core"
import { checkAuthInfoEventHasDone } from "../impl"
import { WaitTime } from "../../../../../../z_vendor/getto-application/infra/config/infra"

// last auth at : テスト開始時刻と expire 設定によって instant load の可否が決まる
const STORED_LAST_AUTH_AT = new Date("2020-01-01 10:00:00").toISOString()

// テスト開始時刻
const START_AT_INSTANT_LOAD_AVAILABLE = new Date("2020-01-01 10:00:10")
const START_AT_INSTANT_LOAD_DISABLED = new Date("2020-01-01 10:00:30")

// renew 設定時刻 : succeed-to-start-continuous-renew でこの時刻に移行
const CONTINUOUS_RENEW_START_AT = new Date("2020-01-01 10:00:40")

// renew ごとに次の時刻に移行
const CONTINUOUS_RENEW_AT = [
    new Date("2020-01-01 10:01:00"),
    new Date("2020-01-01 10:02:00"),
    new Date("2020-01-01 11:00:00"),
]

describe("CheckAuthInfo", () => {
    test("instant load", (done) => {
        const { clock, resource } = instantRenewCredentialResource()

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.core.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "try-to-instant-load",
                            scriptPath: {
                                valid: true,
                                value: "https://secure.example.com/index.js",
                            },
                        },
                    ])
                },
            },
            {
                statement: () => {
                    clock.update(CONTINUOUS_RENEW_START_AT)
                    resource.core.succeedToInstantLoad()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "succeed-to-start-continuous-renew" },
                        { type: "succeed-to-continuous-renew" },
                        { type: "succeed-to-continuous-renew" },
                        { type: "succeed-to-continuous-renew" },
                        { type: "required-to-login" },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("instant load failed", (done) => {
        const { clock, resource } = instantRenewCredentialResource()

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.core.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "try-to-instant-load",
                            scriptPath: {
                                valid: true,
                                value: "https://secure.example.com/index.js",
                            },
                        },
                    ])
                },
            },
            {
                statement: () => {
                    clock.update(CONTINUOUS_RENEW_START_AT)
                    resource.core.failedToInstantLoad()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-renew" },
                        {
                            type: "try-to-load",
                            scriptPath: {
                                valid: true,
                                value: "https://secure.example.com/index.js",
                            },
                        },
                        { type: "succeed-to-continuous-renew" },
                        { type: "succeed-to-continuous-renew" },
                        { type: "required-to-login" },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("renew stored credential", (done) => {
        const { clock, resource } = standardRenewCredentialResource()

        resource.core.subscriber.subscribe((state) => {
            switch (state.type) {
                case "try-to-load":
                    clock.update(CONTINUOUS_RENEW_START_AT)
                    break
            }
        })

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.core.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-renew" },
                        {
                            type: "try-to-load",
                            scriptPath: {
                                valid: true,
                                value: "https://secure.example.com/index.js",
                            },
                        },
                        { type: "succeed-to-continuous-renew" },
                        { type: "succeed-to-continuous-renew" },
                        { type: "required-to-login" },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("renew stored credential; with delayed", (done) => {
        // wait for delayed timeout
        const { clock, resource } = waitRenewCredentialResource()

        resource.core.subscriber.subscribe((state) => {
            switch (state.type) {
                case "try-to-load":
                    clock.update(CONTINUOUS_RENEW_START_AT)
                    break
            }
        })

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.core.ignite()
                },
                examine: (stack) => {
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
                        { type: "succeed-to-continuous-renew" },
                        { type: "succeed-to-continuous-renew" },
                        { type: "required-to-login" },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("renew without stored credential", (done) => {
        // empty credential
        const { repository, resource } = emptyRenewCredentialResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.core.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ type: "required-to-login" }])
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: false,
                    })
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("load error", (done) => {
        const { resource } = standardRenewCredentialResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    resource.core.loadError({ type: "infra-error", err: "load error" })
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "load-error",
                            err: { type: "infra-error", err: "load error" },
                        },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
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
    renew: RenewAuthInfoRemotePod
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
            interval: { interval_millisecond: 64 },
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
        nonce: "stored-authn-nonce",
        lastAuthAt: STORED_LAST_AUTH_AT,
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

function renewRemoteAccess(clock: ClockPubSub, waitTime: WaitTime): RenewAuthInfoRemotePod {
    let count = 0
    return initRemoteSimulator(() => {
        if (count > 2) {
            // 最初の 3回だけ renew して、あとは renew を cancel するための invalid-ticket
            return { success: false, err: { type: "invalid-ticket" } }
        }

        // 現在時刻を動かす
        const nextTime = CONTINUOUS_RENEW_AT[count]
        setTimeout(() => clock.update(nextTime))

        count++
        return {
            success: true,
            value: {
                authn: {
                    nonce: "renewed-authn-nonce",
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
    return initStaticClock(START_AT_INSTANT_LOAD_DISABLED, subscriber)
}
function instantAvailableClock(subscriber: ClockSubscriber): Clock {
    return initStaticClock(START_AT_INSTANT_LOAD_AVAILABLE, subscriber)
}

function actionHasDone(state: CheckAuthInfoResourceState): boolean {
    switch (state.type) {
        case "initial-renew":
        case "try-to-load":
            return false

        case "load-error":
            return true

        case "try-to-instant-load":
        case "try-to-renew":
        case "delayed-to-renew":
        case "required-to-login":
        case "failed-to-renew":
        case "repository-error":
            return checkAuthInfoEventHasDone(state)

        case "succeed-to-start-continuous-renew":
        case "succeed-to-continuous-renew":
        case "lastAuth-not-expired":
        case "failed-to-continuous-renew":
            return startContinuousRenewEventHasDone(state)
    }
}
