import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { standard_MockBaseResource } from "../view_base/mock"

import { initDashboardEntryPoint } from "./impl"

describe("Dashboard", () => {
    test("terminate", (done) => {
        const { entryPoint } = standard_elements()

        const runner = setupSyncActionTestRunner([
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
    return initDashboardEntryPoint(standard_MockBaseResource())
}
