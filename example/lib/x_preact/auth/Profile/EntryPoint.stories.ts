import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../common/getto-example/Application/mock"
import { ProfileMockPropsPasser, newMockDashboard } from "../../../auth/z_EntryPoint/Profile/mock"
import { SeasonInfoMockProps } from "../../../example/x_components/Outline/seasonInfo/mock"
import { MenuListMockProps } from "../../../auth/z_EntryPoint/Outline/menuList/mock"
import { BreadcrumbListMockProps } from "../../../auth/z_EntryPoint/Outline/breadcrumbList/mock"
import { LogoutMockProps } from "../../../auth/x_Resource/Login/ClearCredential/Logout/mock"

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
const Template: Story<MockProps> = (args) => {
    const passer: ProfileMockPropsPasser = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        menuList: initMockPropsPasser<MenuListMockProps>(),
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
        logout: initMockPropsPasser<LogoutMockProps>(),
    }
    const entryPoint = newMockDashboard(passer)
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
            passer.logout.update({ type: "failed", err: "logout error" })
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
