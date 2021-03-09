import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { LoadDocsContentPathComponent } from "./LoadDocsContentPath"

import { mockLoadDocsContentPathResource } from "../mock"
import { standard_MockLoadBreadcrumbListResource } from "../../../outline/menu/action_load_breadcrumb_list/mock"

export default {
    title: "library/Docs/LoadDocsContentPath",
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return h(LoadDocsContentPathComponent, {
        ...standard_MockLoadBreadcrumbListResource(),
        ...mockLoadDocsContentPathResource(),
    })
})

export const Success = template({})
