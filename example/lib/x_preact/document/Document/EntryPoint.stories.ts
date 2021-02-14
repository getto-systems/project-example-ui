import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../vendor/getto-example/Application/mock"
import {
    DocumentMockPropsPasser,
    newMockDocument,
} from "../../../document/x_components/Document/EntryPoint/mock"
import { MenuMockProps } from "../../../common/x_Resource/Outline/Menu/Menu/mock"
import { BreadcrumbListMockProps } from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import { ContentMockProps } from "../../../document/x_components/Document/content/mock"

export default {
    title: "Document/Document",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = Readonly<{
    menuBadgeCount: number
    breadcrumbLabel: string
    breadcrumbIcon: string
}>
const Template: Story<MockProps> = (args) => {
    const passer: DocumentMockPropsPasser = {
        menu: initMockPropsPasser<MenuMockProps>(),
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
        content: initMockPropsPasser<ContentMockProps>(),
    }
    const entryPoint = newMockDocument(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.menu.update({
                type: "success",
                label: "ホーム",
                badgeCount: props.args.menuBadgeCount,
            })
            passer.breadcrumbList.update({
                type: "success",
                label: props.args.breadcrumbLabel,
                icon: props.args.breadcrumbIcon,
            })
            passer.content.update({ type: "success" })
        })
        return noPadded(h(EntryPoint, entryPoint))
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Initial = Template.bind({})
Initial.args = {
    menuBadgeCount: 99,
    breadcrumbLabel: "ホーム",
    breadcrumbIcon: "home",
}
