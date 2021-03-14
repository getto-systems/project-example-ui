import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { ProfileComponent } from "./profile"

import { mockNotifyUnexpectedErrorResource } from "../../../avail/action_unexpected_error/mock"
import { standard_MockLoadBreadcrumbListResource } from "../../../outline/menu/action_load_breadcrumb_list/mock"
import { standard_MockLoadMenuResource } from "../../../outline/menu/action_load_menu/mock"
import { mockLoadSeasonResource } from "../../../example/common/action_load_season/mock"
import { mockLogoutResource } from "../../sign/auth_ticket/action_logout/mock"

export default {
    title: "main/secure/Auth/Profile",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return h(ProfileComponent, {
        ...mockNotifyUnexpectedErrorResource(),
        ...standard_MockLoadBreadcrumbListResource(),
        ...standard_MockLoadMenuResource(),
        ...mockLoadSeasonResource(),
        ...mockLogoutResource(),
    })
})

export const Profile = template({})
