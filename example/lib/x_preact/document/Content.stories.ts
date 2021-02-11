import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { Content } from "./Content"

import { initMockPropsPasser } from "../../sub/getto-example/x_components/Application/mock"
import { ContentMockProps, initMockContentComponent } from "../../document/x_components/Document/content/mock"
import {
    BreadcrumbListMockProps,
    initMockBreadcrumbListComponent,
} from "../../auth/x_components/Outline/breadcrumbList/mock"

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
        content: initMockPropsPasser<ContentMockProps>(),
    }
    const breadcrumbList = initMockBreadcrumbListComponent(passer.breadcrumbList)
    const content = initMockContentComponent(passer.content)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.breadcrumbList.update({ type: "success", label: "ホーム", icon: "home" })
            passer.content.update(props.args)
        })
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
