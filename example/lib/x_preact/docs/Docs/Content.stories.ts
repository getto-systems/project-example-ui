import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { Content } from "./Content"

import { initMockPropsPasser } from "../../../z_vendor/getto-application/action/mock"
import {
    ContentMockProps,
    initMockContentComponent,
} from "../../../docs/x_components/Docs/content/mock"
import {
    initMockLoadBreadcrumbListCoreAction,
    standard_MockBreadcrumbList,
} from "../../../outline/menu/action_load_breadcrumb_list/core/mock"

export default {
    title: "Document/Content",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = ContentMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = {
        content: initMockPropsPasser<ContentMockProps>(),
    }
    const breadcrumbList = initMockLoadBreadcrumbListCoreAction(standard_MockBreadcrumbList())
    const content = initMockContentComponent(passer.content)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.content.update(props.args)
        })
        return h(Content, { content, breadcrumbList })
    }
})

export const Success = template({ type: "success" })
