import { h, VNode } from "preact"

import { Content } from "../../../x_preact/secure/Document/Content"

import {
    mapContentMockProps,
    ContentMockProps,
    initContent,
} from "../../../document/Document/content/mock"
import { initBreadcrumb, mapBreadcrumbMockProps } from "../../../example/Outline/breadcrumbList/mock"

import { initialContentState } from "../../../document/Document/content/component"

export default {
    title: "secure/Document/Content",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = ContentMockProps
const Template: Story<MockProps> = (args) => {
    const content = initContent(initialContentState)
    const breadcrumb = initBreadcrumb(
        mapBreadcrumbMockProps({ type: "success", label: "ホーム", icon: "home" })
    )
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        content.update(mapContentMockProps(props.args))
        return h(Content, { content, breadcrumb })
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Success = Template.bind({})
Success.args = {
    type: "success",
}
