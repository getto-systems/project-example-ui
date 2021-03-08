import {
    initAsyncActionTestRunner,
    initSyncActionTestRunner,
} from "../../../z_vendor/getto-application/action/test_helper"

import { initRemoteSimulator } from "../../../z_vendor/getto-application/infra/remote/simulate"

import { initFindNextVersionLocationDetecter, markApplicationTargetPath } from "../find_next/impl/test_helper"

import { initFindNextVersionEntryPoint } from "./impl"
import { initFindNextVersionCoreAction, initFindNextVersionCoreMaterial } from "./core/impl"

import { findNextVersionEventHasDone } from "../find_next/impl/core"

import { applicationPath } from "../find_next/impl/helper"

import { CheckDeployExistsRemotePod } from "../find_next/infra"

import { FindNextVersionEntryPoint } from "./entry_point"

import { FindNextVersionCoreState } from "./core/action"

describe("FindNextVersion", () => {
    test("up to date", (done) => {
        const { entryPoint } = standard_elements()
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("up to date; delayed", (done) => {
        const { entryPoint } = takeLongTime_elements()
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("found next minor version", (done) => {
        const { entryPoint } = found_elements(["/1.1.0/index.html"])
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("found next patch version", (done) => {
        const { entryPoint } = found_elements(["/1.0.1/index.html"])
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("found next minor version; recursive", (done) => {
        const { entryPoint } = found_elements(["/1.1.0/index.html", "/1.2.0/index.html"])
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("found next patch version; recursive", (done) => {
        const { entryPoint } = found_elements(["/1.0.1/index.html", "/1.0.2/index.html"])
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("found next patch version; complex", (done) => {
        const { entryPoint } = found_elements(["/1.1.0/index.html", "/1.1.1/index.html"])
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("found next patch version; complex skipped", (done) => {
        const { entryPoint } = found_elements([
            "/1.1.0/index.html",
            "/1.1.1/index.html",
            "/1.1.3/index.html",
        ])
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("found next minor version; complex current version", (done) => {
        const { entryPoint } = foundComplex_elements(["/1.1.0/index.html"])
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("invalid version url", (done) => {
        const { entryPoint } = invalidVersion_elements()
        const resource = entryPoint.resource

        const runner = initAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.findNext.ignite()
                },
                examine: (stack) => {
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
                },
            },
        ])

        resource.findNext.subscriber.subscribe(runner(done))
    })

    test("valid ApplicationTargetPath", () => {
        expect(
            applicationPath("1.0.0", {
                valid: true,
                value: markApplicationTargetPath("/path/to/target.html"),
            }),
        ).toEqual("/1.0.0/path/to/target.html")
    })

    test("invalid ApplicationTargetPath", () => {
        expect(applicationPath("1.0.0", { valid: false })).toEqual("/1.0.0/index.html")
    })

    test("terminate", (done) => {
        const { entryPoint } = standard_elements()

        const runner = initSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    entryPoint.resource.findNext.ignite()

                    setTimeout(check, 256) // wait for event...
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        entryPoint.resource.findNext.subscriber.subscribe(runner(done))
    })
})

function standard_elements() {
    const entryPoint = newEntryPoint(standard_URL(), standard_version(), standard_check())

    return { entryPoint }
}
function found_elements(versions: string[]) {
    const entryPoint = newEntryPoint(standard_URL(), standard_version(), found_check(versions))

    return { entryPoint }
}
function foundComplex_elements(versions: string[]) {
    const entryPoint = newEntryPoint(complex_URL(), complex_Version(), found_check(versions))

    return { entryPoint }
}
function invalidVersion_elements() {
    const entryPoint = newEntryPoint(invalidVersion_URL(), standard_version(), standard_check())

    return { entryPoint }
}
function takeLongTime_elements() {
    const entryPoint = newEntryPoint(standard_URL(), standard_version(), takeLongTime_check())

    return { entryPoint }
}

function newEntryPoint(
    currentURL: URL,
    version: string,
    check: CheckDeployExistsRemotePod,
): FindNextVersionEntryPoint {
    return initFindNextVersionEntryPoint({
        findNext: initFindNextVersionCoreAction(
            initFindNextVersionCoreMaterial(
                {
                    check,
                    version,
                    config: {
                        delay: { delay_millisecond: 1 },
                    },
                },
                initFindNextVersionLocationDetecter(currentURL, version),
            ),
        ),
    })
}

function standard_version(): string {
    return "1.0.0"
}
function complex_Version(): string {
    return "1.0.0-rc1"
}

function standard_URL(): URL {
    return new URL("https://example.com/1.0.0/index.html?search=parameter#hash")
}
function complex_URL(): URL {
    return new URL("https://example.com/1.0.0-rc1/index.html?search=parameter#hash")
}
function invalidVersion_URL(): URL {
    return new URL("https://example.com/invalid.html?search=parameter#hash")
}

function standard_check(): CheckDeployExistsRemotePod {
    return initRemoteSimulator(() => ({ success: true, value: { found: false } }), {
        wait_millisecond: 0,
    })
}
function found_check(versions: string[]): CheckDeployExistsRemotePod {
    return initRemoteSimulator(
        (version) => {
            return { success: true, value: { found: versions.includes(version) } }
        },
        { wait_millisecond: 0 },
    )
}
function takeLongTime_check(): CheckDeployExistsRemotePod {
    return initRemoteSimulator(() => ({ success: true, value: { found: false } }), {
        wait_millisecond: 2,
    })
}

function actionHasDone(state: FindNextVersionCoreState): boolean {
    switch (state.type) {
        case "initial-next-version":
            return false

        default:
            return findNextVersionEventHasDone(state)
    }
}
