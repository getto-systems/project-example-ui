import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockAuthProfileResource } from "./mock"

import { initProfileView } from "./impl"

describe("Profile", () => {
    test("terminate", () =>
        new Promise<void>((done) => {
            const { view } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: (check) => {
                        view.terminate()
                        view.resource.menu.ignite()
                        view.resource.logout.submit()

                        setTimeout(check, 256) // wait for events.
                    },
                    examine: (stack) => {
                        // no event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            const handler = runner(done)
            view.resource.menu.subscriber.subscribe(handler)
            view.resource.logout.subscriber.subscribe(handler)
        }))
})

function standard() {
    const view = initView()

    return { view }
}

function initView() {
    return initProfileView(mockAuthProfileResource())
}
