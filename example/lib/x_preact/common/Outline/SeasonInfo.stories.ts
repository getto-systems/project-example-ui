import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import { copyright, siteInfo } from "../site"
import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { MenuList } from "./MenuList"
import { SeasonInfo } from "./SeasonInfo"

import { initMockPropsPasser } from "../../../common/getto-example/Application/mock"
import {
    initMockMenuListComponent,
    MenuListMockProps,
} from "../../../auth/z_EntryPoint/Outline/menuList/mock"
import {
    SeasonInfoMockProps,
    initMockSeasonInfoComponent,
} from "../../../example/x_components/Outline/seasonInfo/mock"

export default {
    title: "Outline/SeasonInfo",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = SeasonInfoMockProps
const Template: Story<MockProps> = (args) => {
    const passer = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        menuList: initMockPropsPasser<MenuListMockProps>(),
    }
    const seasonInfo = initMockSeasonInfoComponent(passer.seasonInfo)
    const menuList = initMockMenuListComponent(passer.menuList)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.seasonInfo.update(props.args)
            passer.menuList.update({
                type: "success",
                label: "ホーム",
                badgeCount: 0,
            })
        })
        return noPadded(
            appLayout({
                siteInfo: siteInfo(),
                header: [h(SeasonInfo, { seasonInfo })],
                main: appMain({
                    header: mainHeader([mainTitle("タイトル")]),
                    body: mainBody("コンテンツ"),
                    copyright: copyright(),
                }),
                menu: h(MenuList, { menuList }),
            })
        )
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Success = Template.bind({})
Success.args = {
    type: "success",
    year: new Date().getFullYear(),
}

export const Failed = Template.bind({})
Failed.args = {
    type: "failed",
    err: "load error",
}
