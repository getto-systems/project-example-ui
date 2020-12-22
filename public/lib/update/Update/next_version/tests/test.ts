import { newNextVersionResource, NextVersionSimulator } from "./core"

import { NextVersionState } from "../component"
import { appTargetToPath, versionToString } from "../../../next_version/data"

describe("NextVersion", () => {
    test("up to date", (done) => {
        const { resource } = standardNextVersionResource()

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        done(new Error(state.type))
                        break

                    case "failed-to-find":
                        expect(state).toEqual({ type: "failed-to-find", err: { type: "up-to-date" } })
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("found next minor version", (done) => {
        const { resource } = foundNextVersionResource(["1.1.0"])

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(state).toEqual({
                            type: "succeed-to-find",
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
                        })
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

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(state).toEqual({
                            type: "succeed-to-find",
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
                        })
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

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(state).toEqual({
                            type: "succeed-to-find",
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
                        })
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

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(state).toEqual({
                            type: "succeed-to-find",
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
                        })
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

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(state).toEqual({
                            type: "succeed-to-find",
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
                        })
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

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(state).toEqual({
                            type: "succeed-to-find",
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
                        })
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

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(state).toEqual({
                            type: "succeed-to-find",
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
                        })
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

    test("invalid versioned url", (done) => {
        const { resource } = invalidVersionNextVersionResource()

        resource.nextVersion.onStateChange(stateHandler())

        resource.nextVersion.find()

        function stateHandler(): Post<NextVersionState> {
            return (state) => {
                switch (state.type) {
                    case "initial-next-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        done(new Error(state.type))
                        break

                    case "failed-to-find":
                        expect(state).toEqual({
                            type: "failed-to-find",
                            err: { type: "out-of-versioned" },
                        })
                        done()
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
    const simulator = standardSimulator()
    const resource = newNextVersionResource(version, currentURL, simulator)

    return { resource }
}
function foundNextVersionResource(versions: string[]) {
    const version = standardVersion()
    const currentURL = standardURL()
    const simulator = foundSimulator(versions)
    const resource = newNextVersionResource(version, currentURL, simulator)

    return { resource }
}
function foundComplexNextVersionResource(versions: string[]) {
    const version = complexVersion()
    const currentURL = complexURL()
    const simulator = foundSimulator(versions)
    const resource = newNextVersionResource(version, currentURL, simulator)

    return { resource }
}
function invalidVersionNextVersionResource() {
    const version = standardVersion()
    const currentURL = invalidVersionURL()
    const simulator = standardSimulator()
    const resource = newNextVersionResource(version, currentURL, simulator)

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
function standardSimulator(): NextVersionSimulator {
    return {
        check: {
            check: async (_version) => {
                return false
            },
        },
    }
}
function foundSimulator(versions: string[]): NextVersionSimulator {
    return {
        check: {
            check: async (version) => {
                return versions.includes(versionToString(version))
            },
        },
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
