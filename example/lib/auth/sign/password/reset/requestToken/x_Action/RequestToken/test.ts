import { initAsyncActionTester_legacy } from "../../../../../../../z_getto/application/testHelper"
import { standardBoardValueStore } from "../../../../../../../z_getto/board/input/x_Action/Input/testHelper"

import { initRequestPasswordResetTokenCoreAction } from "./Core/impl"
import { initRequestPasswordResetTokenFormAction } from "./Form/impl"

import { delayed } from "../../../../../../../z_getto/infra/delayed/core"
import { newBoardValidateStack } from "../../../../../../../z_getto/board/kernel/infra/stack"
import { initRequestPasswordResetTokenSimulate } from "../../infra/remote/requestToken/simulate"

import { requestPasswordResetTokenEventHasDone } from "../../impl"

import { RequestPasswordResetTokenRemote, RequestPasswordResetTokenResult } from "../../infra"

import { RequestPasswordResetTokenAction } from "./action"
import { RequestPasswordResetTokenCoreState } from "./Core/action"

import { markBoardValue } from "../../../../../../../z_getto/board/kernel/data"
import { markPasswordResetSessionID } from "../../../kernel/data"

const VALID_LOGIN = { loginID: "login-id" } as const
const SESSION_ID = "session-id" as const

describe("RequestPasswordResetToken", () => {
    test("submit valid login-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.core.addStateHandler(initTester())

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

        resource.core.addStateHandler(initTester())

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

        resource.core.addStateHandler(initTester())

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
    request: RequestPasswordResetTokenRemote
}>

function newTestPasswordResetSessionResource(
    remote: PasswordResetSessionTestRemoteAccess,
): RequestPasswordResetTokenAction {
    const config = standardConfig()
    const action = {
        core: initRequestPasswordResetTokenCoreAction({
            request: {
                ...remote,
                config: config.session.request,
                delayed,
            },
        }),

        form: initRequestPasswordResetTokenFormAction({
            stack: newBoardValidateStack(),
        }),
    }

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
        request: initRequestPasswordResetTokenSimulate(simulateRequestToken, {
            wait_millisecond: 0,
        }),
    }
}
function waitRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        request: initRequestPasswordResetTokenSimulate(simulateRequestToken, {
            wait_millisecond: 3,
        }),
    }
}

function simulateRequestToken(): RequestPasswordResetTokenResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}

function initAsyncTester() {
    return initAsyncActionTester_legacy((state: RequestPasswordResetTokenCoreState) => {
        switch (state.type) {
            case "initial-request-token":
                return false

            case "try-to-request-token":
            case "delayed-to-request-token":
            case "failed-to-request-token":
            case "succeed-to-request-token":
                return requestPasswordResetTokenEventHasDone(state)
        }
    })
}
