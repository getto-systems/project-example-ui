import { h, VNode } from "preact"

import { Content } from "../../x_preact/Document/Content"

import {
    mapContentMockProps,
    ContentMockProps,
    initMockContentComponent,
} from "../../document/Document/content/mock"
import {
    initMockBreadcrumbListComponent,
    mapBreadcrumbMockProps,
} from "../../auth/Outline/breadcrumbList/mock"

import { initialContentState } from "../../document/Document/content/component"

export default {
    title: "Document/Content",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = ContentMockProps
const Template: Story<MockProps> = (args) => {
    const content = initMockContentComponent(initialContentState)
    const breadcrumbList = initMockBreadcrumbListComponent(
        mapBreadcrumbMockProps({ type: "success", label: "ホーム", icon: "home" })
    )
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        content.update(mapContentMockProps(props.args))
        return h(Content, { content, breadcrumbList })
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
