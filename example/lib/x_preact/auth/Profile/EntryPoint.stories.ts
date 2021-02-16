import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
import { AuthProfileMockPropsPasser, newMockAuthProfile } from "../../../auth/z_EntryPoint/Profile/mock"
import { SeasonInfoMockProps } from "../../../example/x_components/Outline/seasonInfo/mock"
import { MenuMockProps } from "../../../common/x_Resource/Outline/Menu/Menu/mock"
import { BreadcrumbListMockProps } from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import { ClearAuthCredentialMockProps } from "../../../auth/sign/x_Action/AuthCredential/Clear/mock"

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
    const passer: AuthProfileMockPropsPasser = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        menu: initMockPropsPasser<MenuMockProps>(),
        breadcrumbList: initMockPropsPasser<BreadcrumbListMockProps>(),
        logout: initMockPropsPasser<ClearAuthCredentialMockProps>(),
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
            passer.logout.update({ type: "failed-clear-authCredential", err: "logout error" })
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
