import { h, VNode } from "preact"
import { html } from "htm/preact"

import { Document } from "../../../x_preact/secure/Document/Document"

import { newDocument } from "../../../document/Document/Document/mock"
import { mapContentMockProps } from "../../../document/Document/content/mock"
import { mapBreadcrumbMockProps } from "../../../auth/Outline/breadcrumbList/mock"
import { mapMenuMockProps } from "../../../auth/Outline/menuList/mock"

export default {
    title: "secure/Document/Document",
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
    const { document, update } = newDocument()
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        update.menuList(mapMenuMockProps({ type: "success", badgeCount: props.args.menuBadgeCount }))
        update.breadcrumbList(
            mapBreadcrumbMockProps({
                type: "success",
                label: props.args.breadcrumbLabel,
                icon: props.args.breadcrumbIcon,
            })
        )
        update.content(mapContentMockProps({ type: "success" }))
        return html`
            <style>
                .sb-main-padded {
                    padding: 0 !important;
                }
            </style>
            ${h(Document, { document })}
        `
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
