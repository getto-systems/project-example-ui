import {
    initAsyncActionTestRunner,
    initSyncActionTestRunner,
} from "../../../../../z_vendor/getto-application/action/test_helper"

import {
    ClockPubSub,
    initStaticClock,
    staticClockPubSub,
} from "../../../../../z_vendor/getto-application/infra/clock/simulate"
import { initMemoryDB } from "../../../../../z_vendor/getto-application/infra/repository/memory"
import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"

import { initGetScriptPathLocationDetecter } from "../../../common/secure/get_script_path/impl/test_helper"

import { wrapRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"
import { toCheckAuthInfoEntryPoint } from "./impl"
import { initCheckAuthInfoCoreAction, initCheckAuthInfoCoreMaterial } from "./core/impl"

import { startContinuousRenewEventHasDone } from "../common/start_continuous_renew/impl/core"
import { checkAuthInfoEventHasDone } from "../check/impl/core"

import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { WaitTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import { LastAuthRepositoryPod, RenewAuthInfoRemotePod } from "../kernel/infra"

import { CheckAuthInfoEntryPoint } from "./entry_point"

import { CheckAuthInfoCoreState } from "./core/action"

// last auth at : テスト開始時刻と expire 設定によって instant load の可否が決まる
const STORED_LAST_AUTH_AT = new Date("2020-01-01 10:00:00").toISOString()

// テスト開始時刻
const START_AT_INSTANT_LOAD_AVAILABLE = new Date("2020-01-01 10:00:10")
const START_AT = new Date("2020-01-01 10:00:30")

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
        const { clock, entryPoint } = instantLoadable_elements()
        const resource = entryPoint.resource

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
        const { clock, entryPoint } = instantLoadable_elements()
        const resource = entryPoint.resource

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
        const { clock, entryPoint } = standard_elements()
        const resource = entryPoint.resource

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

    test("renew stored credential; take long time", (done) => {
        // wait for delayed timeout
        const { clock, entryPoint } = takeLongTime_elements()
        const resource = entryPoint.resource

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
        const { entryPoint } = noStored_elements()
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.core.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ type: "required-to-login" }])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("load error", (done) => {
        const { entryPoint } = standard_elements()
        const resource = entryPoint.resource

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
        const { entryPoint } = standard_elements()

        const runner = initSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    entryPoint.resource.core.ignite()

                    setTimeout(check, 256) // wait for event...
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

function standard_elements() {
    const clockPubSub = staticClockPubSub()
    const entryPoint = newEntryPoint(
        standard_lastAuth(),
        standard_authz(),
        standard_renew(clockPubSub),
        initStaticClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, entryPoint }
}
function instantLoadable_elements() {
    const clockPubSub = staticClockPubSub()
    const entryPoint = newEntryPoint(
        standard_lastAuth(),
        standard_authz(),
        standard_renew(clockPubSub),
        initStaticClock(START_AT_INSTANT_LOAD_AVAILABLE, clockPubSub),
    )

    return { clock: clockPubSub, entryPoint }
}
function takeLongTime_elements() {
    const clockPubSub = staticClockPubSub()
    const entryPoint = newEntryPoint(
        standard_lastAuth(),
        standard_authz(),
        wait_renew(clockPubSub),
        initStaticClock(START_AT, clockPubSub),
    )
    return { clock: clockPubSub, entryPoint }
}
function noStored_elements() {
    const clockPubSub = staticClockPubSub()
    const entryPoint = newEntryPoint(
        noStored_lastAuth(),
        noStored_authz(),
        standard_renew(clockPubSub),
        initStaticClock(START_AT, clockPubSub),
    )
    return { entryPoint }
}

function newEntryPoint(
    lastAuth: LastAuthRepositoryPod,
    authz: AuthzRepositoryPod,
    renew: RenewAuthInfoRemotePod,
    clock: Clock,
): CheckAuthInfoEntryPoint {
    const currentURL = new URL("https://example.com/index.html")
    const getScriptPathDetecter = initGetScriptPathLocationDetecter(currentURL)
    return toCheckAuthInfoEntryPoint(
        initCheckAuthInfoCoreAction(
            initCheckAuthInfoCoreMaterial(
                {
                    check: {
                        lastAuth,
                        authz,
                        renew,
                        config: {
                            instantLoadExpire: { expire_millisecond: 20 * 1000 },
                            takeLongTimeThreshold: { delay_millisecond: 32 },
                        },
                        clock,
                    },
                    startContinuousRenew: {
                        lastAuth,
                        authz,
                        renew,
                        config: {
                            interval: { interval_millisecond: 128 },
                            lastAuthExpire: { expire_millisecond: 1 * 1000 },
                        },
                        clock,
                    },
                    getSecureScriptPath: {
                        config: {
                            secureServerURL: "https://secure.example.com",
                        },
                    },
                },
                getScriptPathDetecter,
            ),
        ),
    )
}

function standard_lastAuth(): LastAuthRepositoryPod {
    const lastAuth = initMemoryDB()
    lastAuth.set({
        nonce: "stored-authn-nonce",
        lastAuthAt: STORED_LAST_AUTH_AT,
    })
    return wrapRepository(lastAuth)
}
function noStored_lastAuth(): LastAuthRepositoryPod {
    return wrapRepository(initMemoryDB())
}

function standard_authz(): AuthzRepositoryPod {
    const lastAuth = initMemoryDB()
    lastAuth.set({
        nonce: "api-nonce",
        roles: ["role"],
    })
    return wrapRepository(lastAuth)
}
function noStored_authz(): AuthzRepositoryPod {
    return wrapRepository(initMemoryDB())
}

function standard_renew(clock: ClockPubSub): RenewAuthInfoRemotePod {
    return renewPod(clock, { wait_millisecond: 0 })
}
function wait_renew(clock: ClockPubSub): RenewAuthInfoRemotePod {
    // wait for delayed timeout
    return renewPod(clock, { wait_millisecond: 64 })
}
function renewPod(clock: ClockPubSub, waitTime: WaitTime): RenewAuthInfoRemotePod {
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

function actionHasDone(state: CheckAuthInfoCoreState): boolean {
    switch (state.type) {
        case "initial-check":
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
