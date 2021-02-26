import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"
import { noPaddedStory } from "../../../z_vendor/storybook/preact/display"

import { copyright, siteInfo } from "../site"
import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { Menu } from "./Menu"
import { SeasonInfo } from "./SeasonInfo"

import { initMockPropsPasser } from "../../../z_getto/action/mock"
import {
    initMockMenuComponent,
    MenuMockProps,
} from "../../../common/x_Resource/Outline/Menu/Menu/mock"
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
const template = storyTemplate<MockProps>((args) => {
    const passer = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        menuList: initMockPropsPasser<MenuMockProps>(),
    }
    const seasonInfo = initMockSeasonInfoComponent(passer.seasonInfo)
    const menu = initMockMenuComponent(passer.menuList)
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
        return noPaddedStory(
            appLayout({
                siteInfo: siteInfo(),
                header: [h(SeasonInfo, { seasonInfo })],
                main: appMain({
                    header: mainHeader([mainTitle("タイトル")]),
                    body: mainBody("コンテンツ"),
                    copyright: copyright(),
                }),
                menu: h(Menu, { menu }),
            })
        )
    }
})

export const Success = template({ type: "success", year: new Date().getFullYear() })
export const Failed = template({ type: "failed", err: "load error" })
