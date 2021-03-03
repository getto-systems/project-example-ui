import {
    ClockPubSub,
    ClockSubscriber,
    initStaticClock,
    staticClockPubSub,
} from "../../../../../../z_vendor/getto-application/infra/clock/simulate"

import { AuthenticateRemotePod, AuthenticateResult } from "../../infra"
import { Clock } from "../../../../../../z_vendor/getto-application/infra/clock/infra"

import { AuthenticatePasswordAction } from "./action"

import { CoreState } from "./Core/action"

import { markSecureScriptPath } from "../../../../common/secureScriptPath/get/data"
import { AuthenticateFields } from "../../data"
import {
    LastAuthRepositoryPod,
    LastAuthRepositoryValue,
    RenewRemotePod,
} from "../../../../kernel/authInfo/kernel/infra"
import { newGetSecureScriptPathLocationInfo } from "../../../../common/secureScriptPath/get/impl"
import { ticker } from "../../../../../../z_vendor/getto-application/infra/timer/helper"
import { authenticateEventHasDone } from "../../impl"
import {
    initAsyncActionTestRunner,
    initSyncActionTestRunner,
} from "../../../../../../z_vendor/getto-application/action/testHelper"
import { markBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/testHelper"
import { initFormAction } from "./Form/impl"
import { standardBoardValueStore } from "../../../../../../z_vendor/getto-application/board/input/Action/testHelper"
import { toAction, toEntryPoint } from "./impl"
import { initCoreAction, initCoreMaterial } from "./Core/impl"
import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../../../common/authz/infra"
import { initMemoryDB } from "../../../../../../z_vendor/getto-application/infra/repository/memory"
import { wrapRepository } from "../../../../../../z_vendor/getto-application/infra/repository/helper"
import { lastAuthRepositoryConverter } from "../../../../kernel/authInfo/kernel/convert"
import { initRemoteSimulator } from "../../../../../../z_vendor/getto-application/infra/remote/simulate"

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

const AUTHORIZED_AUTHN_NONCE = "authn-nonce" as const

const RENEWED_AUTHN_NONCE = "renewed-authn-nonce" as const
const SUCCEED_TO_RENEW_AT = [new Date("2020-01-01 10:01:00"), new Date("2020-01-01 11:00:00")]

// renew リクエストを投げるべきかの判定に使用する
// setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

// continuous renew リクエストを投げるべきかの判定に使用する
// テストが完了したら clock が返す値をこっちにする
const COMPLETED_NOW = new Date("2020-01-01 11:00:00")

describe("AuthenticatePassword", () => {
    test("submit valid login-id and password", (done) => {
        const { repository, clock, resource } = standardPasswordLoginResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
                    resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    clock.update(COMPLETED_NOW)
                    expect(stack).toEqual([
                        { type: "try-to-login" },
                        {
                            type: "try-to-load",
                            scriptPath: markSecureScriptPath("https://secure.example.com/index.js"),
                        },
                    ])
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: true,
                        value: {
                            nonce: AUTHORIZED_AUTHN_NONCE,
                            lastAuthAt: NOW,
                        },
                    })
                },
            },
            {
                statement: (check) => {
                    // after setContinuousRenew interval and delay
                    ticker({ wait_millisecond: 1 }, check)
                },
                examine: () => {
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: true,
                        value: {
                            nonce: RENEWED_AUTHN_NONCE,
                            lastAuthAt: SUCCEED_TO_RENEW_AT[0],
                        },
                    })
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { repository, clock, resource } = waitPasswordLoginResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
                    resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))

                    resource.core.submit(resource.form.validate.get())
                },
                examine: (stack) => {
                    clock.update(COMPLETED_NOW)
                    expect(stack).toEqual([
                        { type: "try-to-login" },
                        { type: "delayed-to-login" }, // delayed event
                        {
                            type: "try-to-load",
                            scriptPath: markSecureScriptPath("https://secure.example.com/index.js"),
                        },
                    ])
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: true,
                        value: {
                            nonce: AUTHORIZED_AUTHN_NONCE,
                            lastAuthAt: NOW,
                        },
                    })
                },
            },
            {
                statement: (check) => {
                    // after setContinuousRenew interval and delay
                    ticker({ wait_millisecond: 1 }, check)
                },
                examine: () => {
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: true,
                        value: {
                            nonce: RENEWED_AUTHN_NONCE,
                            lastAuthAt: SUCCEED_TO_RENEW_AT[0],
                        },
                    })
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("submit without fields", (done) => {
        const { repository, resource } = standardPasswordLoginResource()
        const lastAuth = repository.lastAuth(lastAuthRepositoryConverter)

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
                    expect(lastAuth.get()).toEqual({
                        success: true,
                        found: false,
                    })
                },
            },
        ])

        resource.core.subscriber.subscribe(runner(done))
    })

    test("clear", () => {
        const { resource } = standardPasswordLoginResource()

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.password.board.input.set(markBoardValue(VALID_LOGIN.password))
        resource.form.clear()

        expect(resource.form.loginID.board.input.get()).toEqual("")
        expect(resource.form.password.board.input.get()).toEqual("")
    })

    test("load error", (done) => {
        const { resource } = standardPasswordLoginResource()

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
        const { resource } = standardPasswordLoginResource()
        const entryPoint = toEntryPoint(resource)

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

function standardPasswordLoginResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = standardSimulator(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newTestPasswordLoginResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}
function waitPasswordLoginResource() {
    const currentURL = standardURL()
    const repository = standardRepository()
    const clockPubSub = staticClockPubSub()
    const simulator = waitSimulator(clockPubSub)
    const clock = standardClock(clockPubSub)
    const resource = newTestPasswordLoginResource(currentURL, repository, simulator, clock)

    return { repository, clock: clockPubSub, resource }
}

type PasswordLoginTestRepository = Readonly<{
    authz: AuthzRepositoryPod
    lastAuth: LastAuthRepositoryPod
}>
type PasswordLoginTestRemoteAccess = Readonly<{
    authenticate: AuthenticateRemotePod
    renew: RenewRemotePod
}>

function newTestPasswordLoginResource(
    currentURL: URL,
    repository: PasswordLoginTestRepository,
    remote: PasswordLoginTestRemoteAccess,
    clock: Clock,
): AuthenticatePasswordAction {
    const config = standardConfig()
    const action = toAction({
        core: initCoreAction(
            initCoreMaterial(
                {
                    startContinuousRenew: {
                        ...repository,
                        ...remote,
                        config: config.continuousRenew,
                        clock,
                    },
                    getSecureScriptPath: {
                        config: config.location,
                    },
                    authenticate: {
                        ...remote,
                        config: config.login,
                        clock,
                    },
                },
                newGetSecureScriptPathLocationInfo(currentURL),
            ),
        ),

        form: initFormAction(),
    })

    action.form.loginID.board.input.storeLinker.link(standardBoardValueStore())
    action.form.password.board.input.storeLinker.link(standardBoardValueStore())

    return action
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function standardConfig() {
    return {
        location: {
            secureServerHost: "secure.example.com",
        },
        login: {
            delay: { delay_millisecond: 1 },
        },
        continuousRenew: {
            interval: { interval_millisecond: 1 },
            delay: { delay_millisecond: 1 },
        },
    }
}
function standardRepository(): PasswordLoginTestRepository {
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({
        nonce: "api-nonce",
        roles: ["role"],
    })

    const lastAuth = initMemoryDB<LastAuthRepositoryValue>()

    return {
        authz: <AuthzRepositoryPod>wrapRepository(authz),
        lastAuth: <LastAuthRepositoryPod>wrapRepository(lastAuth),
    }
}
function standardSimulator(clock: ClockPubSub): PasswordLoginTestRemoteAccess {
    return {
        authenticate: initRemoteSimulator(simulateLogin, {
            wait_millisecond: 0,
        }),
        renew: renewRemoteAccess(clock),
    }
}
function waitSimulator(clock: ClockPubSub): PasswordLoginTestRemoteAccess {
    return {
        authenticate: initRemoteSimulator(simulateLogin, {
            wait_millisecond: 3,
        }),
        renew: renewRemoteAccess(clock),
    }
}

function simulateLogin(_fields: AuthenticateFields): AuthenticateResult {
    return {
        success: true,
        value: {
            authn: {
                nonce: AUTHORIZED_AUTHN_NONCE,
            },
            authz: {
                nonce: "api-nonce",
                roles: ["role"],
            },
        },
    }
}
function renewRemoteAccess(clock: ClockPubSub): RenewRemotePod {
    let renewed = false
    return initRemoteSimulator(
        () => {
            if (renewed) {
                // 最初の一回だけ renew して、あとは renew を cancel するために null を返す
                return { success: false, err: { type: "invalid-ticket" } }
            }

            // 現在時刻を動かす
            const now = SUCCEED_TO_RENEW_AT[0]
            const nextNow = SUCCEED_TO_RENEW_AT[1]
            clock.update(now)
            setTimeout(() => clock.update(nextNow))

            renewed = true
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
        },
        { wait_millisecond: 0 },
    )
}

function standardClock(subscriber: ClockSubscriber): Clock {
    return initStaticClock(NOW, subscriber)
}

function actionHasDone(state: CoreState): boolean {
    switch (state.type) {
        case "initial-login":
            return false

        case "try-to-load":
        case "repository-error":
        case "load-error":
            return true

        default:
            return authenticateEventHasDone(state)
    }
}
