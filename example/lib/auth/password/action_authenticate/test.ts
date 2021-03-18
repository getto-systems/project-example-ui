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

import { markBoardValue } from "../../../z_vendor/getto-application/board/kernel/mock"
import { mockBoardValueStore } from "../../../z_vendor/getto-application/board/action_input/mock"
import { mockGetScriptPathLocationDetecter } from "../../common/secure/get_script_path/impl/mock"

import { wrapRepository } from "../../../z_vendor/getto-application/infra/repository/helper"

import { initAuthenticatePasswordView } from "./impl"
import {
    initAuthenticatePasswordCoreAction,
    initAuthenticatePasswordCoreMaterial,
} from "./core/impl"
import { initAuthenticatePasswordFormAction } from "./form/impl"

import { authenticatePasswordEventHasDone } from "../authenticate/impl/core"
import { startContinuousRenewEventHasDone } from "../../auth_ticket/start_continuous_renew/impl/core"

import { Clock } from "../../../z_vendor/getto-application/infra/clock/infra"
import { AuthenticatePasswordRemotePod, AuthenticatePasswordResult } from "../authenticate/infra"
import { AuthzRepositoryPod } from "../../auth_ticket/kernel/infra"
import { AuthnRepositoryPod, RenewAuthTicketRemotePod } from "../../auth_ticket/kernel/infra"

import { AuthenticatePasswordView } from "./resource"

import { AuthenticatePasswordCoreState } from "./core/action"

import { AuthenticatePasswordFields } from "../authenticate/data"

// テスト開始時刻
const START_AT = new Date("2020-01-01 10:00:00")

// renew 設定時刻 : succeed-to-start-continuous-renew でこの時刻に移行
const CONTINUOUS_RENEW_START_AT = new Date("2020-01-01 10:00:01")

// renew ごとに次の時刻に移行
const CONTINUOUS_RENEW_AT = [new Date("2020-01-01 10:01:00"), new Date("2020-01-01 11:00:00")]

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

describe("AuthenticatePassword", () => {
    test("submit valid login-id and password", (done) => {
        const { clock, view } = standard()
        const resource = view.resource.authenticate

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
                        { type: "try-to-login" },
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

    test("submit valid login-id and password; take long time", (done) => {
        // wait for take longtime timeout
        const { clock, view } = takeLongtime_elements()
        const resource = view.resource.authenticate

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
                        { type: "try-to-login" },
                        { type: "take-longtime-to-login" },
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
        const { view } = standard()
        const resource = view.resource.authenticate

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    // try to login without fields

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "failed-to-login", err: { type: "validation-error" } },
                    ])
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("clear", () => {
        const { view } = standard()
        const resource = view.resource.authenticate

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))
        resource.form.clear()

        expect(resource.form.loginID.board.input.get()).toEqual("")
        expect(resource.form.password.board.input.get()).toEqual("")
    })

    test("load error", (done) => {
        const { view } = standard()
        const resource = view.resource.authenticate

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
        const { view } = standard()
        const resource = view.resource.authenticate

        const runner = setupSyncActionTestRunner([
            {
                statement: () => {
                    view.terminate()
                    resource.form.loginID.board.input.set(markBoardValue("login-id"))
                    resource.form.password.board.input.set(markBoardValue("password"))
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
    const view = initView(
        standard_authenticate(),
        standard_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, view }
}
function takeLongtime_elements() {
    const clockPubSub = mockClockPubSub()
    const view = initView(
        takeLongtime_authenticate(),
        standard_renew(clockPubSub),
        mockClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, view }
}

function initView(
    authenticate: AuthenticatePasswordRemotePod,
    renew: RenewAuthTicketRemotePod,
    clock: Clock,
): AuthenticatePasswordView {
    const currentURL = new URL("https://example.com/index.html")

    const authn = standard_authn()
    const authz = standard_authz()

    const getScriptPathDetecter = mockGetScriptPathLocationDetecter(currentURL)

    const view = initAuthenticatePasswordView({
        core: initAuthenticatePasswordCoreAction(
            initAuthenticatePasswordCoreMaterial(
                {
                    startContinuousRenew: {
                        authn,
                        authz,
                        renew,
                        config: {
                            interval: { interval_millisecond: 128 },
                            authnExpire: { expire_millisecond: 500 },
                        },
                        clock,
                    },
                    getSecureScriptPath: {
                        config: {
                            secureServerURL: "https://secure.example.com",
                        },
                    },
                    authenticate: {
                        authenticate,
                        config: {
                            takeLongtimeThreshold: { delay_millisecond: 32 },
                        },
                        clock,
                    },
                },
                getScriptPathDetecter,
            ),
        ),

        form: initAuthenticatePasswordFormAction(),
    })

    view.resource.authenticate.form.loginID.board.input.storeLinker.link(mockBoardValueStore())
    view.resource.authenticate.form.password.board.input.storeLinker.link(mockBoardValueStore())

    return view
}

function standard_authn(): AuthnRepositoryPod {
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

function standard_authenticate(): AuthenticatePasswordRemotePod {
    return mockRemotePod(simulateAuthenticate, { wait_millisecond: 0 })
}
function takeLongtime_authenticate(): AuthenticatePasswordRemotePod {
    return mockRemotePod(simulateAuthenticate, { wait_millisecond: 64 })
}
function simulateAuthenticate(_fields: AuthenticatePasswordFields): AuthenticatePasswordResult {
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

function standard_renew(clock: ClockPubSub): RenewAuthTicketRemotePod {
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

function actionHasDone(state: AuthenticatePasswordCoreState): boolean {
    switch (state.type) {
        case "initial-login":
        case "try-to-load":
            return false

        case "repository-error":
        case "load-error":
            return true

        case "succeed-to-continuous-renew":
        case "authn-not-expired":
        case "required-to-login":
        case "failed-to-continuous-renew":
            return startContinuousRenewEventHasDone(state)

        default:
            return authenticatePasswordEventHasDone(state)
    }
}
