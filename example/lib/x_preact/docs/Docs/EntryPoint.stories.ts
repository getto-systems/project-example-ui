import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"
import { noPaddedStory } from "../../../z_vendor/storybook/preact/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../z_getto/action/mock"
import {
    DocumentMockPropsPasser,
    newMockDocument,
} from "../../../docs/x_components/Docs/EntryPoint/mock"
import { MenuMockProps } from "../../../common/x_Resource/Outline/Menu/Menu/mock"
import { BreadcrumbListMockProps } from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import { ContentMockProps } from "../../../docs/x_components/Docs/content/mock"

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
const template = storyTemplate<MockProps>((args) => {
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
        return noPaddedStory(h(EntryPoint, entryPoint))
    }
})

export const Initial = template({
    menuBadgeCount: 99,
    breadcrumbLabel: "ホーム",
    breadcrumbIcon: "home",
})
