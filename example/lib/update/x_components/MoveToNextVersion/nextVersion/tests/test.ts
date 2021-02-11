import { newNextVersionResource, NextVersionRemoteAccess } from "./core"

import { initCheckSimulateRemoteAccess } from "../../../../nextVersion/impl/remote/check/simulate"

import { NextVersionActionConfig } from "../../../../nextVersion/infra"

import { NextVersionComponentState } from "../component"

import { appTargetToPath, versionToString } from "../../../../nextVersion/data"

describe("NextVersion", () => {
    test("up to date", (done) => {
        const { resource } = standardNextVersionResource()

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 0,
                                        patch: 0,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.0.0/index.html?search=parameter#hash"
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

    test("up to date; delayed", (done) => {
        const { resource } = waitNextVersionResource()

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 0,
                                        patch: 0,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.0.0/index.html?search=parameter#hash"
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

    test("found next minor version", (done) => {
        const { resource } = foundNextVersionResource(["1.1.0"])

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 1,
                                        patch: 0,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.1.0/index.html?search=parameter#hash"
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

    test("found next patch version", (done) => {
        const { resource } = foundNextVersionResource(["1.0.1"])

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 0,
                                        patch: 1,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.0.1/index.html?search=parameter#hash"
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

    test("found next minor version; recursive", (done) => {
        const { resource } = foundNextVersionResource(["1.1.0", "1.2.0"])

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 2,
                                        patch: 0,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.2.0/index.html?search=parameter#hash"
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

    test("found next patch version; recursive", (done) => {
        const { resource } = foundNextVersionResource(["1.0.1", "1.0.2"])

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 0,
                                        patch: 2,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.0.2/index.html?search=parameter#hash"
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

    test("found next patch version; complex", (done) => {
        const { resource } = foundNextVersionResource(["1.1.0", "1.1.1"])

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 1,
                                        patch: 1,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.1.1/index.html?search=parameter#hash"
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

    test("found next patch version; complex skipped", (done) => {
        const { resource } = foundNextVersionResource(["1.1.0", "1.1.1", "1.1.3"])

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 1,
                                        patch: 1,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.1.1/index.html?search=parameter#hash"
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

    test("found next minor version; complex current version", (done) => {
        const { resource } = foundComplexNextVersionResource(["1.1.0"])

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: true,
                                    pageLocation: {
                                        pathname: "/index.html",
                                        search: "?search=parameter",
                                        hash: "#hash",
                                    },
                                    version: {
                                        major: 1,
                                        minor: 1,
                                        patch: 0,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe(
                            "/1.1.0/index.html?search=parameter#hash"
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

    test("invalid version url", (done) => {
        const { resource } = invalidVersionNextVersionResource()

        resource.nextVersion.addStateHandler(stateHandler())

        resource.nextVersion.find()

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
                                target: {
                                    versioned: false,
                                    version: {
                                        major: 1,
                                        minor: 0,
                                        patch: 0,
                                        suffix: "",
                                        valid: true,
                                    },
                                },
                            },
                        ])
                        expect(appTargetToPath(state.target)).toBe("/1.0.0/index.html")
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
    const resource = newNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function foundNextVersionResource(versions: string[]) {
    const version = standardVersion()
    const currentURL = standardURL()
    const config = standardConfig()
    const simulator = foundSimulator(versions)
    const resource = newNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function foundComplexNextVersionResource(versions: string[]) {
    const version = complexVersion()
    const currentURL = complexURL()
    const config = standardConfig()
    const simulator = foundSimulator(versions)
    const resource = newNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function invalidVersionNextVersionResource() {
    const version = standardVersion()
    const currentURL = invalidVersionURL()
    const config = standardConfig()
    const simulator = standardSimulator()
    const resource = newNextVersionResource(version, currentURL, config, simulator)

    return { resource }
}
function waitNextVersionResource() {
    const version = standardVersion()
    const currentURL = standardURL()
    const config = standardConfig()
    const simulator = waitSimulator()
    const resource = newNextVersionResource(version, currentURL, config, simulator)

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
        check: initCheckSimulateRemoteAccess(() => ({ success: true, value: { found: false } }), {
            wait_millisecond: 0,
        }),
    }
}
function foundSimulator(versions: string[]): NextVersionRemoteAccess {
    return {
        check: initCheckSimulateRemoteAccess(
            (version) => {
                if (!versions.includes(versionToString(version))) {
                    return { success: true, value: { found: false } }
                }
                return { success: true, value: { found: true, version } }
            },
            { wait_millisecond: 0 }
        ),
    }
}
function waitSimulator(): NextVersionRemoteAccess {
    return {
        check: initCheckSimulateRemoteAccess(() => ({ success: true, value: { found: false } }), {
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