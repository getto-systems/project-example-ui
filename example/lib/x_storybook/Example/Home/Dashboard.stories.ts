import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { Dashboard } from "../../../x_preact/Example/Home/Dashboard"

import { initMockPropsPasser } from "../../../sub/getto-example/application/mock"
import { DashboardMockPropsPasser, newMockDashboard } from "../../../example/Home/Dashboard/mock"
import { SeasonInfoMockProps } from "../../../example/Outline/seasonInfo/mock"
import { MenuListMockProps } from "../../../auth/Outline/menuList/mock"
import { BreadcrumbListMockProps } from "../../../auth/Outline/breadcrumbList/mock"
import { ExampleMockProps } from "../../../example/Home/example/mock"

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
    const passer: DashboardMockPropsPasser = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        menuList: initMockPropsPasser<MenuListMockProps>(),
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
        example: initMockPropsPasser<ExampleMockProps>(),
    }
    const dashboard = newMockDashboard(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.seasonInfo.update({ type: "success", year: props.args.seasonYear })
            passer.menuList.update({
                type: "success",
                label: "ホーム",
                badgeCount: props.args.menuBadgeCount,
            })
            passer.breadcrumbList.update({
                type: "success",
                label: props.args.breadcrumbLabel,
                icon: props.args.breadcrumbIcon,
            })
            passer.example.update({ type: "success", year: props.args.seasonYear })
        })
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
