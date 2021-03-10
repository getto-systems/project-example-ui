import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockAuthProfileResource } from "./mock"

import { initProfileEntryPoint } from "./impl"

describe("Profile", () => {
    test("terminate", (done) => {
        const { entryPoint } = standard()

        const runner = setupSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    entryPoint.resource.menu.ignite()
                    entryPoint.resource.logout.submit()

                    setTimeout(check, 256) // wait for events.
                },
                examine: (stack) => {
                    // no event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        const handler = runner(done)
        entryPoint.resource.menu.subscriber.subscribe(handler)
        entryPoint.resource.logout.subscriber.subscribe(handler)
    })
})

function standard() {
    const entryPoint = initEntryPoint()

    return { entryPoint }
}

function initEntryPoint() {
    return initProfileEntryPoint(mockAuthProfileResource())
}
