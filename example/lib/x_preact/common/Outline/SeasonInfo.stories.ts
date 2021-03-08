import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"
import { noPaddedStory } from "../../../z_vendor/storybook/preact/display"

import { copyright, siteInfo } from "../../../common/x_preact/site"
import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/LoadMenu"
import { SeasonInfo } from "./SeasonInfo"

import { initMockPropsPasser } from "../../../z_vendor/getto-application/action/mock"
import { initMockLoadMenuCoreAction, standard_MockMenu } from "../../../outline/menu/action_load_menu/core/mock"
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
    }
    const seasonInfo = initMockSeasonInfoComponent(passer.seasonInfo)
    const menu = initMockLoadMenuCoreAction(standard_MockMenu())
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.seasonInfo.update(props.args)
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
                menu: h(LoadMenu, { menu }),
            }),
        )
    }
})

export const Success = template({ type: "success", year: new Date().getFullYear() })
export const Failed = template({ type: "failed", err: "load error" })
