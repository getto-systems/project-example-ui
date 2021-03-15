import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockBaseResource } from "../action_base/mock"

import { initDashboardEntryPoint } from "./impl"

describe("Dashboard", () => {
    test("terminate", (done) => {
        const { entryPoint } = standard()

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

function standard() {
    const entryPoint = initEntryPoint()

    return { entryPoint }
}

function initEntryPoint() {
    return initDashboardEntryPoint(mockBaseResource())
}
