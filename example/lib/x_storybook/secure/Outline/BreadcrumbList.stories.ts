import { h, VNode } from "preact"
import { html } from "htm/preact"

import { BreadcrumbList } from "../../../x_preact/secure/Outline/BreadcrumbList"

import {
    mapBreadcrumbMockProps,
    BreadcrumbMockProps,
    initBreadcrumb,
} from "../../../example/shared/Outline/breadcrumb/mock"

import { initialBreadcrumbState } from "../../../example/shared/Outline/breadcrumb/component"

export default {
    title: "secure/Outline/BreadcrumbList",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = BreadcrumbMockProps
const Template: Story<MockProps> = (args) => {
    const breadcrumb = initBreadcrumb(initialBreadcrumbState)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        breadcrumb.update(mapBreadcrumbMockProps(props.args))
        return html` <header class="main__header">
            <h1 class="main__title">タイトル</h1>
            ${h(BreadcrumbList, { breadcrumb })}
        </header>`
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Success = Template.bind({})
Success.args = {
    type: "success",
    label: "ホーム",
    icon: "home",
}
