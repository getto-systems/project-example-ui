import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { ProfileComponent } from "./profile"

import { mockNotifyUnexpectedErrorResource } from "../../../avail/action_notify_unexpected_error/mock"
import { mockLoadBreadcrumbListResource } from "../../../outline/menu/action_load_breadcrumb_list/mock"
import { mockLoadMenuResource } from "../../../outline/menu/action_load_menu/mock"
import { mockLoadSeasonResource } from "../../../example/common/action_load_season/mock"
import { mockLogoutResource } from "../../auth_ticket/action_logout/mock"

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
        ...mockLoadBreadcrumbListResource(),
        ...mockLoadMenuResource(),
        ...mockLoadSeasonResource(),
        ...mockLogoutResource(),
    })
})

export const Profile = template({})
