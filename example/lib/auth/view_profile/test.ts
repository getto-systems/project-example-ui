import { initSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { standard_MockNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/mock"
import { standard_MockLoadSeasonResource } from "../../example/common/action_load_season/mock"
import { standard_MockLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/mock"
import { standard_MockLoadMenuResource } from "../../outline/menu/action_load_menu/mock"
import { standard_MockLogoutResource } from "../sign/kernel/auth_info/action_logout/mock"

import { initProfileEntryPoint } from "./impl"

describe("Dashboard", () => {
    test("terminate", (done) => {
        const { entryPoint } = standard_elements()

        const runner = initSyncActionTestRunner([
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

function standard_elements() {
    const entryPoint = newEntryPoint()

    return { entryPoint }
}

function newEntryPoint() {
    return initProfileEntryPoint({
        ...standard_MockNotifyUnexpectedErrorResource(),
        ...standard_MockLoadBreadcrumbListResource(),
        ...standard_MockLoadMenuResource(),
        ...standard_MockLoadSeasonResource(),
        ...standard_MockLogoutResource(),
    })
}
