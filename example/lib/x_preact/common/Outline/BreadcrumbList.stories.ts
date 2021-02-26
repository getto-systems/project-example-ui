import { h } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { BreadcrumbList } from "./BreadcrumbList"

import { initMockPropsPasser } from "../../../z_vendor/getto-application/action/mock"

import {
    BreadcrumbListMockProps,
    initMockBreadcrumbListComponent,
} from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"

export default {
    title: "Outline/BreadcrumbList",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = BreadcrumbListMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<BreadcrumbListMockProps>()
    const breadcrumbList = initMockBreadcrumbListComponent(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return html` <header class="main__header">
            <h1 class="main__title">タイトル</h1>
            ${h(BreadcrumbList, { breadcrumbList })}
        </header>`
    }
})

export const Success = template({ type: "success", label: "ホーム", icon: "home" })
