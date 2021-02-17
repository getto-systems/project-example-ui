import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../z_storybook/story"
import { noPaddedStory } from "../../z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
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
const template = storyTemplate<MockProps>((args) => {
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
        return noPaddedStory(h(EntryPoint, entryPoint))
    }
})

export const Initial = template({
    seasonYear: new Date().getFullYear(),
    menuBadgeCount: 99,
    breadcrumbLabel: "ホーム",
    breadcrumbIcon: "home",
})
