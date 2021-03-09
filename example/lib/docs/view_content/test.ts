import { initSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockDocsContentResource } from "./mock"

import { initDocsContentEntryPoint } from "./impl"

describe("DocsContent", () => {
    test("terminate", (done) => {
        const { entryPoint } = standard_elements()

        const runner = initSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    entryPoint.resource.menu.ignite()

                    setTimeout(check, 256) // wait for events.
                },
                examine: (stack) => {
                    // no event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        entryPoint.resource.menu.subscriber.subscribe(runner(done))
    })
})

function standard_elements() {
    const entryPoint = newEntryPoint()

    return { entryPoint }
}

function newEntryPoint() {
    return initDocsContentEntryPoint(mockDocsContentResource())
}
