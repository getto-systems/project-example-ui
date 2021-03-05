import {
    initAsyncActionTester_legacy,
    initSyncActionTestRunner,
} from "../../../../../../z_vendor/getto-application/action/testHelper"
import { standardBoardValueStore } from "../../../../../../z_vendor/getto-application/board/input/Action/testHelper"
import { markBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/testHelper"

import { initRequestResetTokenCoreMaterial, initRequestResetTokenCoreAction } from "./Core/impl"
import { initRequestResetTokenFormAction } from "./Form/impl"

import { requestResetTokenEventHasDone } from "../impl/core"

import { RequestResetTokenRemotePod, RequestResetTokenResult } from "../infra"

import { RequestResetTokenEntryPoint } from "./action"
import { RequestResetTokenCoreState } from "./Core/action"

import { resetSessionIDRemoteConverter } from "../../kernel/convert"

import { toRequestResetTokenEntryPoint } from "./impl"
import { initRemoteSimulator } from "../../../../../../z_vendor/getto-application/infra/remote/simulate"

const VALID_LOGIN = { loginID: "login-id" } as const

describe("RequestResetToken", () => {
    test("submit valid login-id", (done) => {
        const { entryPoint } = standardPasswordResetSessionResource()
        const resource = entryPoint.resource.requestToken

        resource.core.subscriber.subscribe(initTester())

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-request-token" },
                    { type: "succeed-to-request-token", sessionID: "session-id" },
                ])
                done()
            })
        }
    })

    test("submit valid login-id; with delayed", (done) => {
        // wait for delayed timeout
        const { entryPoint } = waitPasswordResetSessionResource()
        const resource = entryPoint.resource.requestToken

        resource.core.subscriber.subscribe(initTester())

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-request-token" },
                    { type: "delayed-to-request-token" }, // delayed event
                    { type: "succeed-to-request-token", sessionID: "session-id" },
                ])
                done()
            })
        }
    })

    test("submit without fields", (done) => {
        const { entryPoint } = standardPasswordResetSessionResource()
        const resource = entryPoint.resource.requestToken

        resource.core.subscriber.subscribe(initTester())

        // try to request token without fields
        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-request-token", err: { type: "validation-error" } },
                ])
                done()
            })
        }
    })

    test("clear", () => {
        const { entryPoint } = standardPasswordResetSessionResource()
        const resource = entryPoint.resource.requestToken

        resource.form.loginID.board.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.clear()

        expect(resource.form.loginID.board.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { entryPoint } = standardPasswordResetSessionResource()
        const resource = entryPoint.resource.requestToken

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
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
    })
})

function standardPasswordResetSessionResource() {
    const entryPoint = newTestPasswordResetSessionResource(standard_requestToken())

    return { entryPoint }
}
function waitPasswordResetSessionResource() {
    const entryPoint = newTestPasswordResetSessionResource(takeLongTime_requestToken())

    return { entryPoint }
}

function newTestPasswordResetSessionResource(
    requestToken: RequestResetTokenRemotePod,
): RequestResetTokenEntryPoint {
    const entryPoint = toRequestResetTokenEntryPoint({
        core: initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial({
                requestToken,
                config: {
                    delay: { delay_millisecond: 32 },
                },
            }),
        ),

        form: initRequestResetTokenFormAction(),
    })

    entryPoint.resource.requestToken.form.loginID.board.input.storeLinker.link(
        standardBoardValueStore(),
    )

    return entryPoint
}

function standard_requestToken(): RequestResetTokenRemotePod {
    return initRemoteSimulator(simulateRequestToken, { wait_millisecond: 0 })
}
function takeLongTime_requestToken(): RequestResetTokenRemotePod {
    return initRemoteSimulator(simulateRequestToken, { wait_millisecond: 64 })
}
function simulateRequestToken(): RequestResetTokenResult {
    return { success: true, value: resetSessionIDRemoteConverter("session-id") }
}

function initAsyncTester() {
    return initAsyncActionTester_legacy((state: RequestResetTokenCoreState) => {
        switch (state.type) {
            case "initial-request-token":
                return false

            case "try-to-request-token":
            case "delayed-to-request-token":
            case "failed-to-request-token":
            case "succeed-to-request-token":
                return requestResetTokenEventHasDone(state)
        }
    })
}
