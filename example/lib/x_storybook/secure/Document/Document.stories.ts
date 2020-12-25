import { h, VNode } from "preact"
import { html } from "htm/preact"

import { Document } from "../../../x_preact/secure/Document/Document"

import { newDocument } from "../../../document/Document/Document/mock"
import { mapContentMockProps } from "../../../document/Document/content/mock"
import { mapBreadcrumbMockProps } from "../../../example/shared/Outline/breadcrumbList/mock"
import { mapMenuMockProps } from "../../../example/shared/Outline/menuList/mock"

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
        update.menu(mapMenuMockProps({ type: "success", badgeCount: props.args.menuBadgeCount }))
        update.breadcrumb(
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
