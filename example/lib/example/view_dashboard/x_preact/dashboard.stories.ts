import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { DashboardComponent } from "./dashboard"

import { mockNotifyUnexpectedErrorResource } from "../../../avail/action_unexpected_error/mock"
import { mockLoadBreadcrumbListResource } from "../../../outline/menu/action_load_breadcrumb_list/mock"
import { mockLoadMenuResource } from "../../../outline/menu/action_load_menu/mock"
import { mockLoadSeasonResource } from "../../common/action_load_season/mock"

export default {
    title: "main/secure/Example/Dashboard",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return h(DashboardComponent, {
        ...mockNotifyUnexpectedErrorResource(),
        ...mockLoadBreadcrumbListResource(),
        ...mockLoadMenuResource(),
        ...mockLoadSeasonResource(),
    })
})

export const Dashboard = template({})
