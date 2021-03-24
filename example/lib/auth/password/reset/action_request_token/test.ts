import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../../z_vendor/getto-application/action/test_helper"

import { markBoardValue } from "../../../../z_vendor/getto-application/board/kernel/mock"
import { mockBoardValueStore } from "../../../../z_vendor/getto-application/board/action_input/mock"
import { mockRemotePod } from "../../../../z_vendor/getto-application/infra/remote/mock"

import { initRequestResetTokenView } from "./impl"
import { initRequestResetTokenCoreMaterial, initRequestResetTokenCoreAction } from "./core/impl"
import { initRequestResetTokenFormAction } from "./form/impl"

import { requestResetTokenEventHasDone } from "../request_token/impl/core"
import { resetSessionIDRemoteConverter } from "../converter"

import { RequestResetTokenRemotePod, RequestResetTokenResult } from "../request_token/infra"

import { RequestResetTokenView } from "./resource"
import { RequestResetTokenCoreState } from "./core/action"

const VALID_LOGIN = { loginID: "login-id" } as const

describe("RequestResetToken", () => {
    test("submit valid login-id", () =>
        new Promise<void>((done) => {
            const { view } = standard()
            const resource = view.resource.requestToken

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))

                        resource.core.submit(resource.form.validate.get())
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            { type: "try-to-request-token" },
                            { type: "succeed-to-request-token", sessionID: "session-id" },
                        ])
                    },
                },
            ])

            resource.core.subscriber.subscribe(runner(done))
        }))

    test("submit valid login-id; with take longtime", () =>
        new Promise<void>((done) => {
            // wait for take longtime timeout
            const { view } = takeLongtime()
            const resource = view.resource.requestToken

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))

                        resource.core.submit(resource.form.validate.get())
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            { type: "try-to-request-token" },
                            { type: "take-longtime-to-request-token" },
                            { type: "succeed-to-request-token", sessionID: "session-id" },
                        ])
                    },
                },
            ])

            resource.core.subscriber.subscribe(runner(done))
        }))

    test("submit without fields", () =>
        new Promise<void>((done) => {
            const { view } = standard()
            const resource = view.resource.requestToken

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        // try to request token without fields
                        resource.core.submit(resource.form.validate.get())
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            { type: "failed-to-request-token", err: { type: "validation-error" } },
                        ])
                    },
                },
            ])

            resource.core.subscriber.subscribe(runner(done))
        }))

    test("clear", () => {
        const { view } = standard()
        const resource = view.resource.requestToken

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.clear()

        expect(resource.form.loginID.board.input.get()).toEqual("")
    })

    test("terminate", () =>
        new Promise<void>((done) => {
            const { view } = standard()
            const resource = view.resource.requestToken

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        view.terminate()
                        resource.form.loginID.board.input.set(markBoardValue("login-id"))
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
            resource.form.loginID.board.input.subscribeInputEvent(() => handler("input"))
        }))
})

function standard() {
    const view = initView(standard_requestToken())

    return { view }
}
function takeLongtime() {
    const view = initView(takeLongtime_requestToken())

    return { view }
}

function initView(requestToken: RequestResetTokenRemotePod): RequestResetTokenView {
    const view = initRequestResetTokenView({
        core: initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial({
                requestToken,
                config: {
                    takeLongtimeThreshold: { delay_millisecond: 32 },
                },
            }),
        ),

        form: initRequestResetTokenFormAction(),
    })

    view.resource.requestToken.form.loginID.board.input.storeLinker.link(mockBoardValueStore())

    return view
}

function standard_requestToken(): RequestResetTokenRemotePod {
    return mockRemotePod(simulateRequestToken, { wait_millisecond: 0 })
}
function takeLongtime_requestToken(): RequestResetTokenRemotePod {
    return mockRemotePod(simulateRequestToken, { wait_millisecond: 64 })
}
function simulateRequestToken(): RequestResetTokenResult {
    return { success: true, value: resetSessionIDRemoteConverter("session-id") }
}

function actionHasDone(state: RequestResetTokenCoreState): boolean {
    switch (state.type) {
        case "initial-request-token":
            return false

        default:
            return requestResetTokenEventHasDone(state)
    }
}
