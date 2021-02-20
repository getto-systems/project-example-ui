import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../z_storybook/story"

import { Content } from "./Content"

import { initMockPropsPasser } from "../../../z_getto/application/mock"
import {
    ContentMockProps,
    initMockContentComponent,
} from "../../../document/x_components/Document/content/mock"
import {
    BreadcrumbListMockProps,
    initMockBreadcrumbListComponent,
} from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"

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
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
        content: initMockPropsPasser<ContentMockProps>(),
    }
    const breadcrumbList = initMockBreadcrumbListComponent(passer.breadcrumbList)
    const content = initMockContentComponent(passer.content)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.breadcrumbList.update({
                type: "success",
                label: "ホーム",
                icon: "home",
            })
            passer.content.update(props.args)
        })
        return h(Content, { content, breadcrumbList })
    }
})

export const Success = template({ type: "success" })
