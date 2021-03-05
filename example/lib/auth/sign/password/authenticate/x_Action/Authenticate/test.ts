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

import { initGetScriptPathLocationDetecter } from "../../../../common/secure/getScriptPath/impl/testHelper"
import { AuthenticateFields } from "../../data"
import {
    LastAuthRepositoryPod,
    LastAuthRepositoryValue,
    RenewAuthInfoRemotePod,
} from "../../../../kernel/authInfo/kernel/infra"
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
import { startContinuousRenewEventHasDone } from "../../../../kernel/authInfo/common/startContinuousRenew/impl/core"

// テスト開始時刻
const START_AT = new Date("2020-01-01 10:00:00")

// renew 設定時刻 : succeed-to-start-continuous-renew でこの時刻に移行
const CONTINUOUS_RENEW_START_AT = new Date("2020-01-01 10:00:01")

// renew ごとに次の時刻に移行
const CONTINUOUS_RENEW_AT = [new Date("2020-01-01 10:01:00"), new Date("2020-01-01 11:00:00")]

const VALID_LOGIN = { loginID: "login-id", password: "password" } as const

describe("AuthenticatePassword", () => {
    test("submit valid login-id and password", (done) => {
        const { clock, resource } = standardPasswordLoginResource()

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

    test("submit valid login-id and password; with delayed", (done) => {
        // wait for delayed timeout
        const { clock, resource } = waitPasswordLoginResource()

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
    renew: RenewAuthInfoRemotePod
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
                initGetScriptPathLocationDetecter(currentURL),
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
            secureServerURL: "https://secure.example.com",
        },
        login: {
            delay: { delay_millisecond: 1 },
        },
        continuousRenew: {
            interval: { interval_millisecond: 64 },
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
                nonce: "authn-nonce",
            },
            authz: {
                nonce: "api-nonce",
                roles: ["role"],
            },
        },
    }
}
function renewRemoteAccess(clock: ClockPubSub): RenewAuthInfoRemotePod {
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

function standardClock(subscriber: ClockSubscriber): Clock {
    return initStaticClock(START_AT, subscriber)
}

function actionHasDone(state: CoreState): boolean {
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
            return authenticateEventHasDone(state)
    }
}
