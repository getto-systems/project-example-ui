import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockAuthenticatePasswordEntryPoint } from "../sign/password/view_authenticate/mock"
import { mockRequestResetTokenEntryPoint } from "../sign/password/reset/view_request_token/mock"
import { mockResetPasswordEntryPoint } from "../sign/password/reset/view_reset/mock"
import { mockCheckResetTokenSendingStatusEntryPoint } from "../sign/password/reset/view_check_status/mock"
import { mockCheckAuthInfoEntryPoint } from "../sign/kernel/auth_info/action_check/mock"
import { mockSignViewLocationDetecter } from "../sign/view/impl/mock"

import { initSignAction } from "./core/impl"
import { initSignEntryPoint } from "./impl"

import { SignAction, SignActionState } from "./core/action"

describe("SignView", () => {
    test("redirect login view", (done) => {
        const { action } = standard()

        // TODO runner に変えたい
        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-authenticate":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-authenticate" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset request token", (done) => {
        const { action } = passwordReset_requestToken()

        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-reset-requestToken":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-requestToken" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset check status", (done) => {
        const { action } = passwordReset_checkStatus()

        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-reset-checkStatus":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-checkStatus" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset", (done) => {
        const { action } = passwordReset_reset()

        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-reset":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("error", (done) => {
        const { action } = standard()

        action.subscriber.subscribe(stateHandler())

        action.error("view error")

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        expect(stack).toEqual([{ type: "error", err: "view error" }])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("terminate", (done) => {
        const { action } = standard()
        const entryPoint = initSignEntryPoint(action)

        const runner = setupSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
                    entryPoint.resource.view.error("view error")
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        entryPoint.resource.view.subscriber.subscribe(runner(done))
    })
})

function standard() {
    const currentURL = standard_URL()
    const action = initAction(currentURL)

    return { action }
}
function passwordReset_requestToken() {
    const currentURL = passwordReset_requestToken_URL()
    const action = initAction(currentURL)

    return { action }
}
function passwordReset_checkStatus() {
    const currentURL = passwordReset_checkStatus_URL()
    const action = initAction(currentURL)

    return { action }
}
function passwordReset_reset() {
    const currentURL = passwordReset_reset_URL()
    const action = initAction(currentURL)

    return { action }
}

function initAction(currentURL: URL): SignAction {
    return initSignAction(mockSignViewLocationDetecter(currentURL), {
        renew: () => mockCheckAuthInfoEntryPoint(),
        password_authenticate: () => mockAuthenticatePasswordEntryPoint(),
        password_reset: () => mockResetPasswordEntryPoint(),
        password_reset_requestToken: () => mockRequestResetTokenEntryPoint(),
        password_reset_checkStatus: () => mockCheckResetTokenSendingStatusEntryPoint(),
    })
}

function standard_URL(): URL {
    return new URL("https://example.com/index.html")
}
function passwordReset_requestToken_URL(): URL {
    return new URL("https://example.com/index.html?_password_reset=requestToken")
}
function passwordReset_checkStatus_URL(): URL {
    return new URL("https://example.com/index.html?_password_reset=checkStatus")
}
function passwordReset_reset_URL(): URL {
    return new URL("https://example.com/index.html?_password_reset=reset")
}

interface Handler<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
