import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Content } from "../../x_preact/Document/Content"

import { initMockPropsPasser } from "../../sub/getto-example/application/mock"
import {
    mapContentMockProps,
    ContentMockProps,
    initMockContentComponent,
} from "../../document/Document/content/mock"
import {
    BreadcrumbListMockProps,
    initMockBreadcrumbListComponent,
} from "../../auth/Outline/breadcrumbList/mock"

import { initialContentComponentState } from "../../document/Document/content/component"

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
    const passer = {
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
    }
    const content = initMockContentComponent(initialContentComponentState)
    const breadcrumbList = initMockBreadcrumbListComponent(passer.breadcrumbList)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.breadcrumbList.update({ type: "success", label: "ホーム", icon: "home" })
        })
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
