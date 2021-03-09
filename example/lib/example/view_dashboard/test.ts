import { initSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { standard_MockLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/mock"
import { standard_MockLoadMenuResource } from "../../outline/menu/action_load_menu/mock"
import { standard_MockNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/mock"
import { standard_MockLoadSeasonResource } from "../common/action_load_season/mock"

import { initDashboardEntryPoint } from "./impl"

describe("Dashboard", () => {
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
    return initDashboardEntryPoint({
        ...standard_MockNotifyUnexpectedErrorResource(),
        ...standard_MockLoadBreadcrumbListResource(),
        ...standard_MockLoadMenuResource(),
        ...standard_MockLoadSeasonResource(),
    })
}
