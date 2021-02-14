import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../vendor/getto-example/Application/mock"
import {
    DashboardMockPropsPasser,
    newMockDashboard,
} from "../../../example/x_components/Dashboard/EntryPoint/mock"
import { SeasonInfoMockProps } from "../../../example/x_components/Outline/seasonInfo/mock"
import { MenuMockProps } from "../../../common/x_Resource/Outline/Menu/Menu/mock"
import { BreadcrumbListMockProps } from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import { ExampleMockProps } from "../../../example/x_components/Dashboard/example/mock"

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
        menu: initMockPropsPasser<MenuMockProps>(),
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
        example: initMockPropsPasser<ExampleMockProps>(),
    }
    const entryPoint = newMockDashboard(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.seasonInfo.update({ type: "success", year: props.args.seasonYear })
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
            passer.example.update({ type: "success", year: props.args.seasonYear })
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
    seasonYear: new Date().getFullYear(),
    menuBadgeCount: 99,
    breadcrumbLabel: "ホーム",
    breadcrumbIcon: "home",
}
