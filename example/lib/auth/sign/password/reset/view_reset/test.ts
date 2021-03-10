import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../../../z_vendor/getto-application/action/test_helper"

import { markBoardValue } from "../../../../../z_vendor/getto-application/board/kernel/mock"
import { mockBoardValueStore } from "../../../../../z_vendor/getto-application/board/action_input/mock"
import { mockDB } from "../../../../../z_vendor/getto-application/infra/repository/mock"
import {
    ClockPubSub,
    mockClock,
    mockClockPubSub,
} from "../../../../../z_vendor/getto-application/infra/clock/mock"
import { mockRemotePod } from "../../../../../z_vendor/getto-application/infra/remote/mock"

import { mockGetScriptPathLocationDetecter } from "../../../common/secure/get_script_path/impl/mock"
import { mockResetPasswordLocationDetecter } from "../reset/impl/mock"

import { wrapRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

import { initResetPasswordEntryPoint } from "./impl"
import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "./core/impl"
import { initResetPasswordFormAction } from "./form/impl"

import { resetPasswordEventHasDone } from "../reset/impl/core"
import { startContinuousRenewEventHasDone } from "../../../kernel/auth_info/common/start_continuous_renew/impl/core"

import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { ResetPasswordRemotePod, ResetPasswordResult } from "../reset/infra"
import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import {
    LastAuthRepositoryPod,
    RenewAuthInfoRemotePod,
} from "../../../kernel/auth_info/kernel/infra"

import { ResetPasswordEntryPoint } from "./entry_point"

import { ResetPasswordCoreState } from "./core/action"

// テスト開始時刻
const START_AT = new Date("2020-01-01 10:00:00")

// renew 設定時刻 : succeed-to-start-continuous-renew でこの時刻に移行
const CONTINUOUS_RENEW_START_AT = new Date("2020-01-01 10:00:01")

// renew ごとに次の時刻に移行
const CONTINUOUS_RENEW_AT = [new Date("2020-01-01 10:01:00"), new Date("2020-01-01 11:00:00")]

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

describe("RegisterPassword", () => {
    test("submit valid login-id and password", (done) => {
        const { clock, entryPoint } = standard()
        const resource = entryPoint.resource.reset

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
                    resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
                    resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-reset" },
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

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { clock, entryPoint } = takeLongTime()
        const resource = entryPoint.resource.reset

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
                    resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
                    resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-reset" },
                        { type: "delayed-to-reset" }, // delayed event
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

    test("submit without fields", (done) => {
        const { entryPoint } = standard()
        const resource = entryPoint.resource.reset

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    // try to reset without fields

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "failed-to-reset", err: { type: "validation-error" } },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("submit without resetToken", (done) => {
        const { entryPoint } = emptyResetToken()
        const resource = entryPoint.resource.reset

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
                    resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "failed-to-reset", err: { type: "empty-reset-token" } },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("clear", () => {
        const { entryPoint } = standard()
        const resource = entryPoint.resource.reset

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))
        resource.form.clear()

        expect(resource.form.loginID.board.input.get()).toEqual("")
        expect(resource.form.password.board.input.get()).toEqual("")
    })

    test("load error", (done) => {
        const { entryPoint } = standard()
        const resource = entryPoint.resource.reset

        const runner = setupAsyncActionTestRunner(actionHasDone, [
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
        const { entryPoint } = standard()
        const resource = entryPoint.resource.reset

        const runner = setupSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    resource.form.loginID.board.input.set(markBoardValue("login-id"))
                    resource.form.password.board.input.set(markBoardValue("password"))

                    setTimeout(check, 256) // wait for events...
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        const handler = runner(done)
        resource.core.subscriber.subscribe(handler)
        resource.form.validate.subscriber.subscribe(handler)
        resource.form.loginID.validate.subscriber.subscribe(handler)
        resource.form.password.validate.subscriber.subscribe(handler)
        resource.form.loginID.board.input.subscribeInputEvent(() => handler("input"))
        resource.form.password.board.input.subscribeInputEvent(() => handler("input"))
    })
})

function standard() {
    const clockPubSub = mockClockPubSub()
    const entryPoint = initEntryPoint(
        standard_URL(),
        standard_reset(),
        standard_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, entryPoint }
}
function takeLongTime() {
    const clockPubSub = mockClockPubSub()
    const entryPoint = initEntryPoint(
        standard_URL(),
        takeLongTime_reset(),
        standard_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, entryPoint }
}
function emptyResetToken() {
    const clockPubSub = mockClockPubSub()
    const entryPoint = initEntryPoint(
        emptyResetToken_URL(),
        standard_reset(),
        standard_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )

    return { entryPoint }
}

function initEntryPoint(
    currentURL: URL,
    reset: ResetPasswordRemotePod,
    renew: RenewAuthInfoRemotePod,
    clock: Clock,
): ResetPasswordEntryPoint {
    const lastAuth = standard_lastAuth()
    const authz = standard_authz()

    const detecter = {
        getSecureScriptPath: mockGetScriptPathLocationDetecter(currentURL),
        reset: mockResetPasswordLocationDetecter(currentURL),
    }

    const entryPoint = initResetPasswordEntryPoint({
        core: initResetPasswordCoreAction(
            initResetPasswordCoreMaterial(
                {
                    startContinuousRenew: {
                        lastAuth,
                        authz,
                        renew,
                        config: {
                            interval: { interval_millisecond: 64 },
                            lastAuthExpire: { expire_millisecond: 500 },
                        },
                        clock,
                    },
                    getSecureScriptPath: {
                        config: {
                            secureServerURL: "https://secure.example.com",
                        },
                    },
                    reset: {
                        reset,
                        config: {
                            delay: { delay_millisecond: 32 },
                        },
                        clock,
                    },
                },
                detecter,
            ),
        ),

        form: initResetPasswordFormAction(),
    })

    entryPoint.resource.reset.form.loginID.board.input.storeLinker.link(mockBoardValueStore())
    entryPoint.resource.reset.form.password.board.input.storeLinker.link(mockBoardValueStore())

    return entryPoint
}

function standard_URL(): URL {
    return new URL("https://example.com/index.html?-password-reset-token=reset-token")
}
function emptyResetToken_URL(): URL {
    return new URL("https://example.com/index.html")
}

function standard_lastAuth(): LastAuthRepositoryPod {
    return wrapRepository(mockDB())
}
function standard_authz(): AuthzRepositoryPod {
    const authz = mockDB()
    authz.set({
        nonce: "api-nonce",
        roles: ["role"],
    })
    return wrapRepository(authz)
}

function standard_reset(): ResetPasswordRemotePod {
    return mockRemotePod(simulateReset, { wait_millisecond: 0 })
}
function takeLongTime_reset(): ResetPasswordRemotePod {
    return mockRemotePod(simulateReset, { wait_millisecond: 64 })
}
function simulateReset(): ResetPasswordResult {
    return {
        success: true,
        value: {
            authn: {
                nonce: "authn-nonce",
            },
            authz: {
                nonce: "api-nonce",
                roles: ["role"],
            },
        },
    }
}

function standard_renew(clock: ClockPubSub): RenewAuthInfoRemotePod {
    let count = 0
    return mockRemotePod(
        () => {
            if (count > 1) {
                // 最初の 2回だけ renew して、あとは renew を cancel するための invalid-ticket
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
        },
        { wait_millisecond: 0 },
    )
}

function actionHasDone(state: ResetPasswordCoreState): boolean {
    switch (state.type) {
        case "initial-reset":
        case "try-to-load":
            return false

        case "repository-error":
        case "load-error":
            return true

        case "succeed-to-continuous-renew":
        case "lastAuth-not-expired":
        case "required-to-login":
        case "failed-to-continuous-renew":
            return startContinuousRenewEventHasDone(state)

        default:
            return resetPasswordEventHasDone(state)
    }
}
