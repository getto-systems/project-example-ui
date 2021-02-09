import {
    PasswordResetSessionConfig,
    newPasswordResetSessionResource,
    PasswordResetSessionSimulator,
} from "./core"

import { wait } from "../../../../z_infra/delayed/core"
import { SendTokenState } from "../../../profile/passwordReset/impl/remote/session/simulate"

import { PasswordResetSessionComponentState } from "../component"

import {
    Destination,
    markSessionID,
    SessionID,
    StartSessionFields,
} from "../../../profile/passwordReset/data"
import { markInputString, toValidationError } from "../../../../sub/getto-form/action/data"

const VALID_LOGIN = { loginID: "login-id" } as const
const SESSION_ID = "session-id" as const

describe("PasswordResetSession", () => {
    test("submit valid login-id", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.passwordResetSession.addStateHandler(initChecker())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession(resource.form.getStartSessionFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: PasswordResetSessionComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset-session":
                        case "try-to-start-session":
                        case "delayed-to-start-session":
                        case "try-to-check-status":
                        case "retry-to-check-status":
                            // work in progress...
                            return false

                        case "succeed-to-send-token":
                            return true

                        case "failed-to-start-session":
                        case "failed-to-check-status":
                        case "failed-to-send-token":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-start-session" },
                        { type: "try-to-check-status" },
                        {
                            type: "retry-to-check-status",
                            dest: { type: "log" },
                            status: { sending: false },
                        },
                        {
                            type: "retry-to-check-status",
                            dest: { type: "log" },
                            status: { sending: true },
                        },
                        { type: "succeed-to-send-token", dest: { type: "log" } },
                    ])
                    done()
                }
            )
        }
    })

    test("submit valid login-id; with delayed", (done) => {
        // wait for delayed timeout
        const { resource } = waitPasswordResetSessionResource()

        resource.passwordResetSession.addStateHandler(initChecker())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession(resource.form.getStartSessionFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: PasswordResetSessionComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset-session":
                        case "try-to-start-session":
                        case "delayed-to-start-session":
                        case "try-to-check-status":
                        case "retry-to-check-status":
                            // work in progress...
                            return false

                        case "succeed-to-send-token":
                            return true

                        case "failed-to-start-session":
                        case "failed-to-check-status":
                        case "failed-to-send-token":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-start-session" },
                        { type: "delayed-to-start-session" }, // delayed event
                        { type: "try-to-check-status" },
                        {
                            type: "retry-to-check-status",
                            dest: { type: "log" },
                            status: { sending: false },
                        },
                        {
                            type: "retry-to-check-status",
                            dest: { type: "log" },
                            status: { sending: true },
                        },
                        { type: "succeed-to-send-token", dest: { type: "log" } },
                    ])
                    done()
                }
            )
        }
    })

    test("submit valid login-id; with long sending", (done) => {
        // wait for send token check limit
        const { resource } = longSendingPasswordResetSessionResource()

        resource.passwordResetSession.addStateHandler(initChecker())

        resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession(resource.form.getStartSessionFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: PasswordResetSessionComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset-session":
                        case "try-to-start-session":
                        case "delayed-to-start-session":
                        case "try-to-check-status":
                        case "retry-to-check-status":
                            // work in progress...
                            return false

                        case "succeed-to-send-token":
                            throw new Error(state.type)

                        case "failed-to-check-status":
                            return true

                        case "failed-to-start-session":
                        case "failed-to-send-token":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-start-session" },
                        { type: "try-to-check-status" },
                        {
                            type: "retry-to-check-status",
                            dest: { type: "log" },
                            status: { sending: false },
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
                }
            )
        }
    })

    test("submit without fields", (done) => {
        const { resource } = standardPasswordResetSessionResource()

        resource.passwordResetSession.addStateHandler(initChecker())

        // try to start session without fields
        //resource.form.loginID.input.input(markInputString(VALID_LOGIN.loginID))

        resource.passwordResetSession.startSession(resource.form.getStartSessionFields())

        function initChecker() {
            return initAsyncStateChecker(
                (state: PasswordResetSessionComponentState): boolean => {
                    switch (state.type) {
                        case "initial-reset-session":
                        case "try-to-start-session":
                        case "delayed-to-start-session":
                        case "try-to-check-status":
                        case "retry-to-check-status":
                            // work in progress...
                            return false

                        case "succeed-to-send-token":
                            throw new Error(state.type)

                        case "failed-to-start-session":
                            return true

                        case "failed-to-check-status":
                        case "failed-to-send-token":
                        case "error":
                            throw new Error(state.type)
                    }
                },
                (stack) => {
                    expect(stack).toEqual([
                        { type: "failed-to-start-session", err: { type: "validation-error" } },
                    ])
                    done()
                }
            )
        }
    })

    describe("form", () => {
        test("initial without input field", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.addStateHandler(checker.handler)

            expect(resource.form.getStartSessionFields()).toEqual({ success: false })

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([
                        {
                            validation: "invalid",
                            history: { undo: false, redo: false },
                        },
                    ])
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

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
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

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
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

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([
                        { value: "loginID-a" },
                        { value: "" },
                        { value: "loginID-a" },
                        { value: "loginID-b" },
                        { value: "loginID-a" },
                        { value: "loginID-c" },
                    ])
                })
            }
        })

        test("removeStateHandler", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)
            resource.form.loginID.input.removeStateHandler(checker.handler)

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([])
                })
            }
        })

        test("terminate", (done) => {
            const { resource } = standardPasswordResetSessionResource()

            const checker = initChecker()
            resource.form.loginID.input.addStateHandler(checker.handler)

            resource.form.terminate()

            resource.form.loginID.input.input(markInputString("loginID-a"))

            checker.test()
            done()

            function initChecker() {
                return initSyncStateChecker((stack) => {
                    expect(stack).toEqual([])
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

                checker.test()
                done()

                function initChecker() {
                    return initSyncStateChecker((stack) => {
                        expect(stack).toEqual([{ result: toValidationError(["empty"]) }])
                    })
                }
            })
        })
    })
})

function standardPasswordResetSessionResource() {
    const config = standardConfig()
    const simulator = standardSimulator()
    const resource = newPasswordResetSessionResource(config, simulator)

    return { resource }
}
function waitPasswordResetSessionResource() {
    const config = standardConfig()
    const simulator = waitSimulator()
    const resource = newPasswordResetSessionResource(config, simulator)

    return { resource }
}
function longSendingPasswordResetSessionResource() {
    const config = standardConfig()
    const simulator = longSendingSimulator()
    const resource = newPasswordResetSessionResource(config, simulator)

    return { resource }
}

function standardConfig(): PasswordResetSessionConfig {
    return {
        application: {
            secureScriptPath: {
                secureServerHost: "secure.example.com",
            },
        },
        passwordResetSession: {
            startSession: {
                delay: { delay_millisecond: 1 },
            },
            checkStatus: {
                wait: { wait_millisecond: 2 },
                limit: { limit: 5 },
            },
        },
    }
}
function standardSimulator(): PasswordResetSessionSimulator {
    return {
        session: {
            startSession: async (fields) => {
                return simulateStartSession(fields)
            },
            sendToken: async (post) => {
                return simulateSendToken(post, standardSendTokenTime())
            },
            getDestination: async (sessionID) => {
                return simulateGetDestination(sessionID)
            },
        },
    }
}
function waitSimulator(): PasswordResetSessionSimulator {
    return {
        session: {
            startSession: async (fields) => {
                // wait for delayed timeout
                await wait({ wait_millisecond: 3 }, () => null)
                return simulateStartSession(fields)
            },
            sendToken: async (post) => {
                return simulateSendToken(post, standardSendTokenTime())
            },
            getDestination: async (sessionID) => {
                return simulateGetDestination(sessionID)
            },
        },
    }
}
function longSendingSimulator(): PasswordResetSessionSimulator {
    return {
        session: {
            startSession: async (fields) => {
                return simulateStartSession(fields)
            },
            sendToken: async (post) => {
                return simulateSendToken(post, longSendTokenTime())
            },
            getDestination: async (sessionID) => {
                return simulateGetDestination(sessionID)
            },
        },
    }
}

function simulateStartSession(_fields: StartSessionFields): SessionID {
    return markSessionID(SESSION_ID)
}
function standardSendTokenTime(): SendTokenTime {
    return {
        waiting_millisecond: 0,
        sending_millisecond: 2,
        success_millisecond: 4,
    }
}
function longSendTokenTime(): SendTokenTime {
    return {
        waiting_millisecond: 0,
        sending_millisecond: 2,
        success_millisecond: 100, // 2msec 間隔で 5回 check するのでそのあと success する
    }
}
function simulateSendToken(post: Post<SendTokenState>, sendTokenTime: SendTokenTime): true {
    setTimeout(() => {
        post({ state: "waiting" })
    }, sendTokenTime.waiting_millisecond)
    setTimeout(() => {
        post({ state: "sending" })
    }, sendTokenTime.sending_millisecond)
    setTimeout(() => {
        post({ state: "success" })
    }, sendTokenTime.success_millisecond)
    return true
}
function simulateGetDestination(_sessionID: SessionID): Destination {
    return { type: "log" }
}

function initAsyncStateChecker<S>(isFinish: { (state: S): boolean }, examine: { (stack: S[]): void }) {
    const stack: S[] = []

    return (state: S) => {
        stack.push(state)

        if (isFinish(state)) {
            examine(stack)
        }
    }
}

function initSyncStateChecker<S>(examine: { (stack: S[]): void }) {
    const stack: S[] = []

    return {
        handler: (state: S) => {
            stack.push(state)
        },
        test: () => {
            examine(stack)
        },
    }
}

interface Post<T> {
    (state: T): void
}

type SendTokenTime = {
    waiting_millisecond: number
    sending_millisecond: number
    success_millisecond: number
}
