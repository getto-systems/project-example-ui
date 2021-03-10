import {
    initAsyncActionTestRunner,
    initSyncActionTestRunner,
} from "../../../../z_vendor/getto-application/action/test_helper"

import {
    ClockPubSub,
    initStaticClock,
    staticClockPubSub,
} from "../../../../z_vendor/getto-application/infra/clock/simulate"
import { initMemoryDB } from "../../../../z_vendor/getto-application/infra/repository/memory"
import { initRemoteSimulator } from "../../../../z_vendor/getto-application/infra/remote/simulate"

import { markBoardValue } from "../../../../z_vendor/getto-application/board/kernel/mock"
import { mockBoardValueStore } from "../../../../z_vendor/getto-application/board/action_input/mock"
import { initGetScriptPathLocationDetecter } from "../../common/secure/get_script_path/impl/test_helper"

import { wrapRepository } from "../../../../z_vendor/getto-application/infra/repository/helper"

import { toAuthenticatePasswordEntryPoint } from "./impl"
import {
    initAuthenticatePasswordCoreAction,
    initAuthenticatePasswordCoreMaterial,
} from "./core/impl"
import { initAuthenticatePasswordFormAction } from "./form/impl"

import { authenticatePasswordEventHasDone } from "../authenticate/impl/core"
import { startContinuousRenewEventHasDone } from "../../kernel/auth_info/common/start_continuous_renew/impl/core"

import { Clock } from "../../../../z_vendor/getto-application/infra/clock/infra"
import { AuthenticatePasswordRemotePod, AuthenticatePasswordResult } from "../authenticate/infra"
import { AuthzRepositoryPod } from "../../../../common/authz/infra"
import { LastAuthRepositoryPod, RenewAuthInfoRemotePod } from "../../kernel/auth_info/kernel/infra"

import { AuthenticatePasswordEntryPoint } from "./entry_point"

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
        const { clock, entryPoint } = standard_elements()
        const resource = entryPoint.resource.authenticate

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
        // wait for delayed timeout
        const { clock, entryPoint } = takeLongTime_elements()
        const resource = entryPoint.resource.authenticate

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
                    resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
                    resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-login" },
                        { type: "delayed-to-login" }, // delayed event
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
        const { entryPoint } = standard_elements()
        const resource = entryPoint.resource.authenticate

        const runner = initAsyncActionTestRunner(actionHasDone, [
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
        const { entryPoint } = standard_elements()
        const resource = entryPoint.resource.authenticate

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))
        resource.form.clear()

        expect(resource.form.loginID.board.input.get()).toEqual("")
        expect(resource.form.password.board.input.get()).toEqual("")
    })

    test("load error", (done) => {
        const { entryPoint } = standard_elements()
        const resource = entryPoint.resource.authenticate

        const runner = initAsyncActionTestRunner(actionHasDone, [
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
        const resource = entryPoint.resource.authenticate

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
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

function standard_elements() {
    const clockPubSub = staticClockPubSub()
    const entryPoint = newEntryPoint(
        standard_authenticate(),
        standard_renew(clockPubSub),
        initStaticClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, entryPoint }
}
function takeLongTime_elements() {
    const clockPubSub = staticClockPubSub()
    const entryPoint = newEntryPoint(
        takeLongTime_authenticate(),
        standard_renew(clockPubSub),
        initStaticClock(START_AT, clockPubSub),
    )

    return { clock: clockPubSub, entryPoint }
}

function newEntryPoint(
    authenticate: AuthenticatePasswordRemotePod,
    renew: RenewAuthInfoRemotePod,
    clock: Clock,
): AuthenticatePasswordEntryPoint {
    const currentURL = new URL("https://example.com/index.html")

    const lastAuth = standard_lastAuth()
    const authz = standard_authz()

    const getScriptPathDetecter = initGetScriptPathLocationDetecter(currentURL)

    const entryPoint = toAuthenticatePasswordEntryPoint({
        core: initAuthenticatePasswordCoreAction(
            initAuthenticatePasswordCoreMaterial(
                {
                    startContinuousRenew: {
                        lastAuth,
                        authz,
                        renew,
                        config: {
                            interval: { interval_millisecond: 128 },
                            lastAuthExpire: { expire_millisecond: 500 },
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
                            takeLongTimeThreshold: { delay_millisecond: 32 },
                        },
                        clock,
                    },
                },
                getScriptPathDetecter,
            ),
        ),

        form: initAuthenticatePasswordFormAction(),
    })

    entryPoint.resource.authenticate.form.loginID.board.input.storeLinker.link(
        mockBoardValueStore(),
    )
    entryPoint.resource.authenticate.form.password.board.input.storeLinker.link(
        mockBoardValueStore(),
    )

    return entryPoint
}

function standard_lastAuth(): LastAuthRepositoryPod {
    return wrapRepository(initMemoryDB())
}
function standard_authz(): AuthzRepositoryPod {
    const authz = initMemoryDB()
    authz.set({
        nonce: "api-nonce",
        roles: ["role"],
    })
    return wrapRepository(authz)
}

function standard_authenticate(): AuthenticatePasswordRemotePod {
    return initRemoteSimulator(simulateAuthenticate, { wait_millisecond: 0 })
}
function takeLongTime_authenticate(): AuthenticatePasswordRemotePod {
    return initRemoteSimulator(simulateAuthenticate, { wait_millisecond: 64 })
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

function standard_renew(clock: ClockPubSub): RenewAuthInfoRemotePod {
    let count = 0
    return initRemoteSimulator(
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
        case "lastAuth-not-expired":
        case "required-to-login":
        case "failed-to-continuous-renew":
            return startContinuousRenewEventHasDone(state)

        default:
            return authenticatePasswordEventHasDone(state)
    }
}
