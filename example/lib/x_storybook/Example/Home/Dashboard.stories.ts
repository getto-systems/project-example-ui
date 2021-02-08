import { h, VNode } from "preact"
import { html } from "htm/preact"

import { Dashboard } from "../../../x_preact/Example/Home/Dashboard"

import { newMockDashboard } from "../../../example/Home/Dashboard/mock"
import { mapExampleMockProps } from "../../../example/Home/example/mock"
import { mapBreadcrumbMockProps } from "../../../auth/Outline/breadcrumbList/mock"
import { mapMenuMockProps } from "../../../auth/Outline/menuList/mock"
import { mapSeasonMockProps } from "../../../example/Outline/seasonInfo/mock"

export default {
    title: "Example/Home/Dashboard",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = Readonly<{
    seasonYear: number
    menuBadgeCount: number
    breadcrumbLabel: string
    breadcrumbIcon: string
}>
const Template: Story<MockProps> = (args) => {
    const { dashboard, update } = newMockDashboard()
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        update.seasonInfo(mapSeasonMockProps({ type: "success", year: props.args.seasonYear }))
        update.menuList(
            mapMenuMockProps({ type: "success", label: "ホーム", badgeCount: props.args.menuBadgeCount })
        )
        update.breadcrumbList(
            mapBreadcrumbMockProps({
                type: "success",
                label: props.args.breadcrumbLabel,
                icon: props.args.breadcrumbIcon,
            })
        )
        update.example(mapExampleMockProps({ type: "success", year: props.args.seasonYear }))
        return html`
            <style>
                .sb-main-padded {
                    padding: 0 !important;
                }
            </style>
            ${h(Dashboard, { dashboard })}
        `
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Initial = Template.bind({})
Initial.args = {
    seasonYear: new Date().getFullYear(),
    menuBadgeCount: 99,
    breadcrumbLabel: "ホーム",
    breadcrumbIcon: "home",
}
