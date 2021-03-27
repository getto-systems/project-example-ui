import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../z_vendor/getto-application/action/test_helper"

import {
    ClockPubSub,
    mockClock,
    mockClockPubSub,
} from "../../../z_vendor/getto-application/infra/clock/mock"
import { mockDB } from "../../../z_vendor/getto-application/infra/repository/mock"
import { mockRemotePod } from "../../../z_vendor/getto-application/infra/remote/mock"

import { mockGetScriptPathLocationDetecter } from "../../common/secure/get_script_path/impl/mock"

import { wrapRepository } from "../../../z_vendor/getto-application/infra/repository/helper"
import { initCheckAuthTicketView } from "./impl"
import { initCheckAuthTicketCoreAction, initCheckAuthTicketCoreMaterial } from "./core/impl"

import { startContinuousRenewEventHasDone } from "../start_continuous_renew/impl/core"
import { checkAuthTicketEventHasDone } from "../check/impl/core"

import { Clock } from "../../../z_vendor/getto-application/infra/clock/infra"
import { WaitTime } from "../../../z_vendor/getto-application/infra/config/infra"
import { AuthzRepositoryPod } from "../kernel/infra"
import { AuthnRepositoryPod, RenewAuthTicketRemotePod } from "../kernel/infra"

import { CheckAuthTicketView } from "./resource"

import { CheckAuthTicketCoreState } from "./core/action"

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

describe("CheckAuthTicket", () => {
    test("instant load", () =>
        new Promise<void>((done) => {
            const { clock, view } = instantLoadable()
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
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
        }))

    test("instant load failed", () =>
        new Promise<void>((done) => {
            const { clock, view } = instantLoadable()
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
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
        }))

    test("renew stored credential", () =>
        new Promise<void>((done) => {
            const { clock, view } = standard()
            const resource = view.resource

            resource.core.subscriber.subscribe((state) => {
                switch (state.type) {
                    case "try-to-load":
                        clock.update(CONTINUOUS_RENEW_START_AT)
                        break
                }
            })

            const runner = setupAsyncActionTestRunner(actionHasDone, [
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
        }))

    test("renew stored credential; take long time", () =>
        new Promise<void>((done) => {
            // wait for take longtime timeout
            const { clock, view } = takeLongtime()
            const resource = view.resource

            resource.core.subscriber.subscribe((state) => {
                switch (state.type) {
                    case "try-to-load":
                        clock.update(CONTINUOUS_RENEW_START_AT)
                        break
                }
            })

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.core.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            { type: "try-to-renew" },
                            { type: "take-longtime-to-renew" },
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
        }))

    test("renew without stored credential", () =>
        new Promise<void>((done) => {
            // empty credential
            const { view } = noStored()
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
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
        }))

    test("load error", () =>
        new Promise<void>((done) => {
            const { view } = standard()
            const resource = view.resource

            const runner = setupSyncActionTestRunner([
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
        }))

    test("terminate", () =>
        new Promise<void>((done) => {
            const { view } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: (check) => {
                        view.terminate()
                        view.resource.core.ignite()

                        setTimeout(check, 256) // wait for event...
                    },
                    examine: (stack) => {
                        // no input/validate event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            view.resource.core.subscriber.subscribe(runner(done))
        }))
})

function standard() {
    const clockPubSub = mockClockPubSub()
    const view = initView(
        standard_authn(),
        standard_authz(),
        standard_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, view }
}
function instantLoadable() {
    const clockPubSub = mockClockPubSub()
    const view = initView(
        standard_authn(),
        standard_authz(),
        standard_renew(clockPubSub),
        mockClock(START_AT_INSTANT_LOAD_AVAILABLE, clockPubSub),
    )

    return { clock: clockPubSub, view }
}
function takeLongtime() {
    const clockPubSub = mockClockPubSub()
    const view = initView(
        standard_authn(),
        standard_authz(),
        wait_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )
    return { clock: clockPubSub, view }
}
function noStored() {
    const clockPubSub = mockClockPubSub()
    const view = initView(
        noStored_authn(),
        noStored_authz(),
        standard_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )
    return { view }
}

function initView(
    authn: AuthnRepositoryPod,
    authz: AuthzRepositoryPod,
    renew: RenewAuthTicketRemotePod,
    clock: Clock,
): CheckAuthTicketView {
    const currentURL = new URL("https://example.com/index.html")
    const getScriptPathDetecter = mockGetScriptPathLocationDetecter(currentURL)
    return initCheckAuthTicketView(
        initCheckAuthTicketCoreAction(
            initCheckAuthTicketCoreMaterial(
                {
                    check: {
                        authn,
                        authz,
                        renew,
                        config: {
                            instantLoadExpire: { expire_millisecond: 20 * 1000 },
                            takeLongtimeThreshold: { delay_millisecond: 32 },
                        },
                        clock,
                    },
                    startContinuousRenew: {
                        authn,
                        authz,
                        renew,
                        config: {
                            interval: { interval_millisecond: 128 },
                            authnExpire: { expire_millisecond: 1 * 1000 },
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

function standard_authn(): AuthnRepositoryPod {
    const db = mockDB()
    db.set({
        nonce: "stored-authn-nonce",
        authAt: STORED_LAST_AUTH_AT,
    })
    return wrapRepository(db)
}
function noStored_authn(): AuthnRepositoryPod {
    return wrapRepository(mockDB())
}

function standard_authz(): AuthzRepositoryPod {
    const db = mockDB()
    db.set({
        nonce: "api-nonce",
        roles: ["role"],
    })
    return wrapRepository(db)
}
function noStored_authz(): AuthzRepositoryPod {
    return wrapRepository(mockDB())
}

function standard_renew(clock: ClockPubSub): RenewAuthTicketRemotePod {
    return renewPod(clock, { wait_millisecond: 0 })
}
function wait_renew(clock: ClockPubSub): RenewAuthTicketRemotePod {
    // wait for take longtime timeout
    return renewPod(clock, { wait_millisecond: 64 })
}
function renewPod(clock: ClockPubSub, waitTime: WaitTime): RenewAuthTicketRemotePod {
    let count = 0
    return mockRemotePod(() => {
        if (count > 2) {
            // 最初の 3回だけ renew して、あとは renew を cancel するための unauthorized
            return { success: false, err: { type: "unauthorized" } }
        }

        // 現在時刻を動かす
        const nextTime = CONTINUOUS_RENEW_AT[count]
        setTimeout(() => clock.update(nextTime))

        count++
        return {
            success: true,
            value: {
                roles: ["role"],
            },
        }
    }, waitTime)
}

function actionHasDone(state: CheckAuthTicketCoreState): boolean {
    switch (state.type) {
        case "initial-check":
        case "try-to-load":
            return false

        case "load-error":
            return true

        case "try-to-instant-load":
        case "try-to-renew":
        case "take-longtime-to-renew":
        case "required-to-login":
        case "failed-to-renew":
        case "repository-error":
            return checkAuthTicketEventHasDone(state)

        case "succeed-to-start-continuous-renew":
        case "succeed-to-continuous-renew":
        case "authn-not-expired":
        case "failed-to-continuous-renew":
            return startContinuousRenewEventHasDone(state)
    }
}
