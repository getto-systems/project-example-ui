import { setupActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockDocsResource } from "./mock"

import { initDocsView } from "./impl"

describe("DocsContent", () => {
    test("terminate", async () => {
        const { view } = standard()

        const runner = setupActionTestRunner(view.resource.menu.subscriber)

        await runner(() => {
            view.terminate()
            return view.resource.menu.ignite()
        }).then((stack) => {
            // no event after terminate
            expect(stack).toEqual([])
        })
    })
})

function standard() {
    const view = initView()

    return { view }
}

function initView() {
    return initDocsView(mockDocsResource())
}
