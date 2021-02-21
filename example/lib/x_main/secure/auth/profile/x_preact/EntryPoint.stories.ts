import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { View } from "./EntryPoint"

import { AuthProfileMockPropsPasser, initMockAuthProfileResource } from "../mock"

import { initMockPropsPasser } from "../../../../../z_getto/application/mock"

import { SeasonInfoMockProps } from "../../../../../example/x_components/Outline/seasonInfo/mock"
import { MenuMockProps } from "../../../../../common/x_Resource/Outline/Menu/Menu/mock"
import { BreadcrumbListMockProps } from "../../../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"

export default {
    title: "main/secure/Auth/Profile",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = Readonly<{
    seasonYear: number
    menuBadgeCount: number
    breadcrumbLabel: string
    breadcrumbIcon: string
}>
const template = storyTemplate<MockProps>((args) => {
    const passer: AuthProfileMockPropsPasser = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        menu: initMockPropsPasser<MenuMockProps>(),
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
    }
    const resource = initMockAuthProfileResource(passer)
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
        })
        return h(View, resource)
    }
})

export const Initial = template({
    seasonYear: new Date().getFullYear(),
    menuBadgeCount: 99,
    breadcrumbLabel: "ホーム",
    breadcrumbIcon: "home",
})
