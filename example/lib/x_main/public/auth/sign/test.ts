import { initLoginViewLocationInfo, View } from "./impl"

import { AuthSignActionState } from "./entryPoint"

import { initMockAuthenticatePasswordResource } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/mock"
import { initMockRequestPasswordResetTokenResource } from "../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/mock"
import { initMockResetPasswordResource } from "../../../../auth/sign/password/reset/reset/x_Action/Reset/mock"
import { initMockStartPasswordResetSessionResource } from "../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/mock"
import { initMockRenewAuthnInfoResource } from "../../../../auth/sign/kernel/authInfo/check/Action/mock"

describe("LoginView", () => {
    test("redirect login view", (done) => {
        const { view } = standardLoginView()

        view.subscriber.subscribe(stateHandler())

        view.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
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
        const { view } = passwordResetSessionLoginView()

        view.subscriber.subscribe(stateHandler())

        view.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
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
        const { view } = passwordResetCheckStatusLoginView()

        view.subscriber.subscribe(stateHandler())

        view.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
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
        const { view } = passwordResetLoginView()

        view.subscriber.subscribe(stateHandler())

        view.ignite()

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
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
        const { view } = standardLoginView()

        view.subscriber.subscribe(stateHandler())

        view.error("view error")

        function stateHandler(): Handler<AuthSignActionState> {
            const stack: AuthSignActionState[] = []
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
})

function standardLoginView() {
    const currentURL = standardURL()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () => standardRenewCredentialEntryPoint(),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}
function passwordResetSessionLoginView() {
    const currentURL = passwordResetSessionURL()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () => standardRenewCredentialEntryPoint(),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}
function passwordResetCheckStatusLoginView() {
    const currentURL = passwordResetCheckStatusURL()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () => standardRenewCredentialEntryPoint(),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}
function passwordResetLoginView() {
    const currentURL = passwordResetURL()
    const view = new View(initLoginViewLocationInfo(currentURL), {
        renew: () => standardRenewCredentialEntryPoint(),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })

    return { view }
}

function standardPasswordLoginEntryPoint() {
    return {
        resource: initMockAuthenticatePasswordResource(),
        terminate: () => null,
    }
}
function standardPasswordResetResource() {
    return {
        resource: initMockResetPasswordResource(),
        terminate: () => null,
    }
}
function standardRequestPasswordResetTokenResource() {
    return {
        resource: initMockRequestPasswordResetTokenResource(),
        terminate: () => null,
    }
}
function standardCheckPasswordResetSendingStatusResource() {
    return {
        resource: initMockStartPasswordResetSessionResource(),
        terminate: () => null,
    }
}
function standardRenewCredentialEntryPoint() {
    return {
        resource: initMockRenewAuthnInfoResource(),
        terminate: () => null,
    }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function passwordResetSessionURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=request")
}
function passwordResetCheckStatusURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=checkStatus")
}
function passwordResetURL(): URL {
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
