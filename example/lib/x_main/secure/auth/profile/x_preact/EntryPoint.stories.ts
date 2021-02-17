import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../x_preact/z_storybook/story"
import { noPaddedStory } from "../../../../../x_preact/z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import {
    AuthProfileMockPropsPasser,
    newMockAuthProfile,
} from "../mock"

import { initMockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"

import { SeasonInfoMockProps } from "../../../../../example/x_components/Outline/seasonInfo/mock"
import { MenuMockProps } from "../../../../../common/x_Resource/Outline/Menu/Menu/mock"
import { BreadcrumbListMockProps } from "../../../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import { LogoutMockProps } from "../../../../../auth/sign/kernel/authnInfo/clear/x_Action/Logout/mock"

export default {
    title: "Auth/Profile",
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
    const passer: AuthProfileMockPropsPasser = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        menu: initMockPropsPasser<MenuMockProps>(),
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
        logout: initMockPropsPasser<LogoutMockProps>(),
    }
    const entryPoint = newMockAuthProfile(passer)
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
            passer.logout.update({ type: "failed-logout", err: "logout error" })
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
