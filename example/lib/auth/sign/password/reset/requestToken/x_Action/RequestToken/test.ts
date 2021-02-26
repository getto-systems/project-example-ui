import {
    initAsyncActionTester_legacy,
    initSyncActionTestRunner,
} from "../../../../../../../z_vendor/getto-application/action/testHelper"
import { standardBoardValueStore } from "../../../../../../../z_vendor/getto-application/board/input/x_Action/Input/testHelper"

import { initCoreMaterial, initCoreAction } from "./Core/impl"
import { initFormAction } from "./Form/impl"

import { delayed } from "../../../../../../../z_vendor/getto-application/infra/delayed/core"
import { initRequestTokenSimulate } from "../../infra/remote/requestToken/simulate"

import { requestTokenEventHasDone } from "../../impl"

import { RequestTokenRemote, RequestTokenResult } from "../../infra"

import { RequestPasswordResetTokenAction } from "./action"
import { CoreState } from "./Core/action"

import { markBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { markResetSessionID } from "../../../kernel/data"
import { toAction, toEntryPoint } from "./impl"

const VALID_LOGIN = { loginID: "login-id" } as const
const SESSION_ID = "session-id" as const

describe("RequestPasswordResetToken", () => {
    test("submit valid login-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.core.subscriber.subscribe(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-request-token" },
                    {
                        type: "succeed-to-request-token",
                        href: "?_password_reset=checkStatus&_password_reset_session_id=session-id",
                    },
                ])
                done()
            })
        }
    })

    test("submit valid login-id; with delayed", (done) => {
        // wait for delayed timeout
        const { resource } = waitPasswordResetSessionResource()

        resource.core.subscriber.subscribe(initTester())

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))

        resource.core.submit(resource.form.validate.get())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-request-token" },
                    { type: "delayed-to-request-token" }, // delayed event
                    {
                        type: "succeed-to-request-token",
                        href: "?_password_reset=checkStatus&_password_reset_session_id=session-id",
                    },
                ])
                done()
            })
        }
    })

    test("submit without fields", (done) => {
        const { resource } = standardPasswordResetSessionResource()

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
        const { resource } = standardPasswordResetSessionResource()

        resource.form.loginID.input.set(markBoardValue(VALID_LOGIN.loginID))
        resource.form.clear()

        expect(resource.form.loginID.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { resource } = standardPasswordResetSessionResource()
        const entryPoint = toEntryPoint(resource)

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
                    resource.form.loginID.input.set(markBoardValue("login-id"))
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
        resource.form.loginID.input.subscribeInputEvent(() => handler("input"))
    })
})

function standardPasswordResetSessionResource() {
    const simulator = standardRemoteAccess()
    const resource = newTestPasswordResetSessionResource(simulator)

    return { resource }
}
function waitPasswordResetSessionResource() {
    const simulator = waitRemoteAccess()
    const resource = newTestPasswordResetSessionResource(simulator)

    return { resource }
}

type PasswordResetSessionTestRemoteAccess = Readonly<{
    request: RequestTokenRemote
}>

function newTestPasswordResetSessionResource(
    remote: PasswordResetSessionTestRemoteAccess,
): RequestPasswordResetTokenAction {
    const config = standardConfig()
    const action = toAction({
        core: initCoreAction(
            initCoreMaterial({
                ...remote,
                config: config.session.request,
                delayed,
            }),
        ),

        form: initFormAction(),
    })

    action.form.loginID.input.linkStore(standardBoardValueStore())

    return action
}

function standardConfig() {
    return {
        session: {
            request: {
                delay: { delay_millisecond: 1 },
            },
        },
    }
}
function standardRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        request: initRequestTokenSimulate(simulateRequestToken, {
            wait_millisecond: 0,
        }),
    }
}
function waitRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        request: initRequestTokenSimulate(simulateRequestToken, {
            wait_millisecond: 3,
        }),
    }
}

function simulateRequestToken(): RequestTokenResult {
    return { success: true, value: markResetSessionID(SESSION_ID) }
}

function initAsyncTester() {
    return initAsyncActionTester_legacy((state: CoreState) => {
        switch (state.type) {
            case "initial-request-token":
                return false

            case "try-to-request-token":
            case "delayed-to-request-token":
            case "failed-to-request-token":
            case "succeed-to-request-token":
                return requestTokenEventHasDone(state)
        }
    })
}
