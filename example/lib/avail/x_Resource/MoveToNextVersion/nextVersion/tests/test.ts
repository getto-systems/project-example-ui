import { newTestNextVersionResource, NextVersionRemoteAccess } from "./core"

import { NextVersionActionConfig } from "../../../../nextVersion/infra"

import { NextVersionComponentState } from "../component"

import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"
import { appTargetToPath } from "../../../../nextVersion/helper"

describe("NextVersion", () => {
    test("up to date", (done) => {
        const { resource } = standardNextVersionResource()

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: true,
                                version: "1.0.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("up to date; delayed", (done) => {
        const { resource } = waitNextVersionResource()

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            { type: "delayed-to-find" },
                            {
                                type: "succeed-to-find",
                                upToDate: true,
                                version: "1.0.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next minor version", (done) => {
        const { resource } = foundNextVersionResource(["/1.1.0/index.html"])

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next patch version", (done) => {
        const { resource } = foundNextVersionResource(["/1.0.1/index.html"])

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.0.1",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next minor version; recursive", (done) => {
        const { resource } = foundNextVersionResource(["/1.1.0/index.html", "/1.2.0/index.html"])

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.2.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next patch version; recursive", (done) => {
        const { resource } = foundNextVersionResource(["/1.0.1/index.html", "/1.0.2/index.html"])

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.0.2",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next patch version; complex", (done) => {
        const { resource } = foundNextVersionResource(["/1.1.0/index.html", "/1.1.1/index.html"])

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.1",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next patch version; complex skipped", (done) => {
        const { resource } = foundNextVersionResource([
            "/1.1.0/index.html",
            "/1.1.1/index.html",
            "/1.1.3/index.html",
        ])

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.1",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next minor version; complex current version", (done) => {
        const { resource } = foundComplexNextVersionResource(["/1.1.0/index.html"])

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("invalid version url", (done) => {
        const { resource } = invalidVersionNextVersionResource()

        resource.nextVersion.subscriber.subscribe(stateHandler())

        resource.nextVersion.ignite()

        function stateHandler(): Post<NextVersionComponentState> {
            const stack: NextVersionComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-next-version":
                    case "delayed-to-find":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: true,
                                version: "1.0.0",
                                target: {
                                    valid: false,
                                },
                            },
                        ])
                        expect(appTargetToPath(state.version, state.target)).toBe(
                            "/1.0.0/index.html",
                        )
                        done()
                        break

                    case "failed-to-find":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardNextVersionResource() {
    const version = standardVersion()
    const currentURL = standardURL()
    const config = standardConfig()
    const simulator = standardSimulator()
    const resource = newTestNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function foundNextVersionResource(versions: string[]) {
    const version = standardVersion()
    const currentURL = standardURL()
    const config = standardConfig()
    const simulator = foundSimulator(versions)
    const resource = newTestNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function foundComplexNextVersionResource(versions: string[]) {
    const version = complexVersion()
    const currentURL = complexURL()
    const config = standardConfig()
    const simulator = foundSimulator(versions)
    const resource = newTestNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function invalidVersionNextVersionResource() {
    const version = standardVersion()
    const currentURL = invalidVersionURL()
    const config = standardConfig()
    const simulator = standardSimulator()
    const resource = newTestNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function waitNextVersionResource() {
    const version = standardVersion()
    const currentURL = standardURL()
    const config = standardConfig()
    const simulator = waitSimulator()
    const resource = newTestNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}

function standardVersion(): string {
    return "1.0.0"
}
function complexVersion(): string {
    return "1.0.0-rc1"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/index.html?search=parameter#hash")
}
function complexURL(): URL {
    return new URL("https://example.com/1.0.0-rc1/index.html?search=parameter#hash")
}
function invalidVersionURL(): URL {
    return new URL("https://example.com/invalid.html?search=parameter#hash")
}

function standardConfig(): NextVersionActionConfig {
    return {
        find: {
            delay: { delay_millisecond: 1 },
        },
    }
}

function standardSimulator(): NextVersionRemoteAccess {
    return {
        check: initRemoteSimulator(() => ({ success: true, value: { found: false } }), {
            wait_millisecond: 0,
        }),
    }
}
function foundSimulator(versions: string[]): NextVersionRemoteAccess {
    return {
        check: initRemoteSimulator(
            (version) => {
                return { success: true, value: { found: versions.includes(version) } }
            },
            { wait_millisecond: 0 },
        ),
    }
}
function waitSimulator(): NextVersionRemoteAccess {
    return {
        check: initRemoteSimulator(() => ({ success: true, value: { found: false } }), {
            wait_millisecond: 2,
        }),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
