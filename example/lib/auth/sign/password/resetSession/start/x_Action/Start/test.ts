import { initStartPasswordResetSessionSimulate } from "../../infra/remote/start/simulate"

import { WaitTime } from "../../../../../../../z_getto/infra/config/infra"
import {
    GetPasswordResetSessionStatusRemote,
    GetPasswordResetSessionStatusResult,
    GetPasswordResetSessionStatusResponse,
    SendPasswordResetSessionTokenRemote,
    SendPasswordResetSessionTokenResult,
    StartPasswordResetSessionSessionRemote,
    StartPasswordResetSessionSessionResult,
} from "../../infra"

import { StartPasswordResetSessionState } from "./Core/action"

import { markPasswordResetSessionID } from "../../data"
import {
    markInputString,
    toValidationError,
} from "../../../../../../../z_getto/getto-form/form/data"
import { initFormAction } from "../../../../../../../z_getto/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../../common/field/loginID/main/loginID"
import {
    checkPasswordResetSessionStatusEventHasDone,
    startPasswordResetSessionEventHasDone,
} from "../../impl"
import { delayed, wait } from "../../../../../../../z_getto/infra/delayed/core"
import {
    initAsyncActionTester_legacy,
    initSyncActionChecker_legacy,
} from "../../../../../../../z_getto/application/testHelper"
import { initSendPasswordResetSessionTokenSimulate } from "../../infra/remote/sendToken/simulate"
import { initGetPasswordResetSessionStatusSimulate } from "../../infra/remote/getStatus/simulate"
import { initStartPasswordResetSessionFormAction } from "./Form/impl"
import { initStartPasswordResetSessionAction } from "./Core/impl"
import { StartPasswordResetSessionResource } from "./resource"

const VALID_LOGIN = { loginID: "login-id" } as const
const SESSION_ID = "session-id" as const

describe("PasswordResetSession", () => {
    test("submit valid login-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.start.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-start-session" },
                    { type: "try-to-check-status" },
                    { type: "succeed-to-send-token", dest: { type: "log" } },
                ])
                done()
            })
        }
    })

    test("submit valid login-id; with delayed", (done) => {
        // wait for delayed timeout
        const { resource } = waitPasswordResetSessionResource()

        resource.start.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-start-session" },
                    { type: "delayed-to-start-session" }, // delayed event
                    { type: "try-to-check-status" },
                    { type: "succeed-to-send-token", dest: { type: "log" } },
                ])
                done()
            })
        }
    })

    test("submit valid login-id; with long sending", (done) => {
        // wait for send token check limit
        const { resource } = longSendingPasswordResetSessionResource()

        resource.start.addStateHandler(initTester())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "try-to-start-session" },
                    { type: "try-to-check-status" },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    },
                    {
                        type: "failed-to-check-status",
                        err: { type: "infra-error", err: "overflow check limit" },
                    },
                ])
                done()
            })
        }
    })

    test("submit without fields", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.start.addStateHandler(initTester())

        // try to start session without fields
        //resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.start.submit(resource.form.getStartSessionFields())

        function initTester() {
            return initAsyncTester()((stack) => {
                expect(stack).toEqual([
                    { type: "failed-to-start-session", err: { type: "validation-error" } },
                ])
                done()
            })
        }
    })

    describe("form", () => {
        test("initial without input field", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            expect(resource.form.getStartSessionFields()).toEqual({ success: false })

            checker.done()

            function initChecker() {
                return initSyncActionChecker_legacy((stack) => {
                    expect(stack).toEqual([
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                    ])
                    done()
                })
            }
        })

        test("valid with input valid field", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))
            resource.form.loginID.input.change()

            expect(resource.form.getStartSessionFields()).toEqual({
                success: true,
                value: {
                    loginID: VALID_LOGIN.loginID,
                },
            })

            checker.done()

            function initChecker() {
                return initSyncActionChecker_legacy((stack) => {
                    expect(stack).toEqual([
                        {
                            validation: "valid",
                            history: { undo: false, redo: false },
                        },
                        {
                            validation: "valid",
                            history: { undo: true, redo: false },
                        },
                        {
                            validation: "valid",
                            history: { undo: true, redo: false },
                        },
                    ])
                    done()
                })
            }
        })

        test("invalid with input invalid field", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString(""))
            resource.form.loginID.input.change()

            expect(resource.form.getStartSessionFields()).toEqual({ success: false })

            checker.done()

            function initChecker() {
                return initSyncActionChecker_legacy((stack) => {
                    expect(stack).toEqual([
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                    ])
                    done()
                })
            }
        })

        test("undo / redo", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)

            resource.form.undo()

            resource.form.loginID.input.input(markInputString("loginID-a"))
            resource.form.loginID.input.change()

            resource.form.undo()
            resource.form.redo()

            resource.form.loginID.input.input(markInputString("loginID-b"))
            resource.form.loginID.input.change()

            resource.form.undo()

            resource.form.loginID.input.input(markInputString("loginID-c"))
            resource.form.loginID.input.change()

            resource.form.redo()

            checker.done()

            function initChecker() {
                return initSyncActionChecker_legacy((stack) => {
                    expect(stack).toEqual([
                        { value: "loginID-a" },
                        { value: "" },
                        { value: "loginID-a" },
                        { value: "loginID-b" },
                        { value: "loginID-a" },
                        { value: "loginID-c" },
                    ])
                    done()
                })
            }
        })

        test("removeStateHandler", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)
            resource.form.loginID.input.removeStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.done()

            function initChecker() {
                return initSyncActionChecker_legacy((stack) => {
                    expect(stack).toEqual([])
                    done()
                })
            }
        })

        test("terminate", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)

            resource.form.terminate()

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.done()

            function initChecker() {
                return initSyncActionChecker_legacy((stack) => {
                    expect(stack).toEqual([])
                    done()
                })
            }
        })
    })

    describe("fields", () => {
        describe("loginID", () => {
            test("invalid with empty string", (done) => {
                const { resource } = standardPasswordResetSessionResource()

                const checker = initChecker()
                resource.form.loginID.addStateHandler(checker.handler)

                resource.form.loginID.input.input(markInputString(""))

                checker.done()

                function initChecker() {
                    return initSyncActionChecker_legacy((stack) => {
                        expect(stack).toEqual([{ result: toValidationError(["empty"]) }])
                        done()
                    })
                }
            })
        })
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
function longSendingPasswordResetSessionResource() {
    const simulator = longSendingSimulator()
    const resource = newTestPasswordResetSessionResource(simulator)

    return { resource }
}

type PasswordResetSessionTestRemoteAccess = Readonly<{
    start: StartPasswordResetSessionSessionRemote
    sendToken: SendPasswordResetSessionTokenRemote
    getStatus: GetPasswordResetSessionStatusRemote
}>

function newTestPasswordResetSessionResource(
    remote: PasswordResetSessionTestRemoteAccess
): StartPasswordResetSessionResource {
    const config = standardConfig()
    return {
        start: initStartPasswordResetSessionAction({
            start: {
                ...remote,
                config: config.session.start,
                delayed,
            },
            checkStatus: {
                ...remote,
                config: config.session.checkStatus,
                wait,
            },
        }),
        form: initStartPasswordResetSessionFormAction(formMaterial()),
    }

    function formMaterial() {
        const form = initFormAction()
        const loginID = initLoginIDFormFieldAction()
        return {
            validation: form.validation(),
            history: form.history(),
            loginID: loginID.field(),
        }
    }
}

function standardConfig() {
    return {
        session: {
            start: {
                delay: { delay_millisecond: 1 },
            },
            checkStatus: {
                wait: { wait_millisecond: 2 },
                limit: { limit: 5 },
            },
        },
    }
}
function standardRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulate(simulateStartSession, {
            wait_millisecond: 0,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulate(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function waitRemoteAccess(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulate(simulateStartSession, {
            wait_millisecond: 3,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulate(simulateSendToken, {
            wait_millisecond: 0,
        }),
        getStatus: getStatusRemoteAccess(standardGetStatusResponse(), { wait_millisecond: 0 }),
    }
}
function longSendingSimulator(): PasswordResetSessionTestRemoteAccess {
    return {
        start: initStartPasswordResetSessionSimulate(simulateStartSession, {
            wait_millisecond: 0,
        }),
        sendToken: initSendPasswordResetSessionTokenSimulate(simulateSendToken, {
            wait_millisecond: 3,
        }),
        getStatus: getStatusRemoteAccess(longSendingGetStatusResponse(), { wait_millisecond: 0 }),
    }
}

function simulateStartSession(): StartPasswordResetSessionSessionResult {
    return { success: true, value: markPasswordResetSessionID(SESSION_ID) }
}
function simulateSendToken(): SendPasswordResetSessionTokenResult {
    return { success: true, value: true }
}
function getStatusRemoteAccess(
    responseCollection: GetPasswordResetSessionStatusResponse[],
    interval: WaitTime
): GetPasswordResetSessionStatusRemote {
    let position = 0
    return initGetPasswordResetSessionStatusSimulate((): GetPasswordResetSessionStatusResult => {
        if (responseCollection.length === 0) {
            return { success: false, err: { type: "infra-error", err: "no response" } }
        }
        const response = getResponse()
        position++

        return { success: true, value: response }
    }, interval)

    function getResponse(): GetPasswordResetSessionStatusResponse {
        if (position < responseCollection.length) {
            return responseCollection[position]
        }
        return responseCollection[responseCollection.length - 1]
    }
}
function standardGetStatusResponse(): GetPasswordResetSessionStatusResponse[] {
    return [{ dest: { type: "log" }, done: true, send: true }]
}
function longSendingGetStatusResponse(): GetPasswordResetSessionStatusResponse[] {
    // 完了するまでに 5回以上かかる
    return [
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
        { dest: { type: "log" }, done: false, status: { sending: true } },
    ]
}

function initAsyncTester() {
    return initAsyncActionTester_legacy((state: StartPasswordResetSessionState) => {
        switch (state.type) {
            case "initial-reset-session":
                return false

            case "try-to-start-session":
            case "delayed-to-start-session":
            case "failed-to-start-session":
                return startPasswordResetSessionEventHasDone(state)

            case "try-to-check-status":
            case "retry-to-check-status":
            case "failed-to-check-status":
            case "failed-to-send-token":
            case "succeed-to-send-token":
                return checkPasswordResetSessionStatusEventHasDone(state)
        }
    })
}
