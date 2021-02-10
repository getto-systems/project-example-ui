import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { copyright, siteInfo } from "../../x_preact/common/site"
import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../z_vendor/getto-css/preact/layout/app"

import { MenuList } from "../../x_preact/Outline/MenuList"
import { SeasonInfo } from "../../x_preact/Outline/SeasonInfo"

import { initMockPropsPasser } from "../../sub/getto-example/application/mock"
import { initMockMenuListComponent, MenuListMockProps } from "../../auth/Outline/menuList/mock"
import { SeasonInfoMockProps, initMockSeasonInfoComponent } from "../../example/Outline/seasonInfo/mock"

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
        return html`
            <style>
                .sb-main-padded {
                    padding: 0 !important;
                }
            </style>
            ${app()}
        `

        function app() {
            return appLayout({
                siteInfo: siteInfo(),
                header: [h(SeasonInfo, { seasonInfo })],
                main: appMain({
                    header: mainHeader([mainTitle("タイトル")]),
                    body: mainBody("コンテンツ"),
                    copyright: copyright(),
                }),
                menu: h(MenuList, { menuList }),
            })
        }
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
