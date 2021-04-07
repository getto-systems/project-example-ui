import { h } from "preact"

import { storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { copyright, siteInfo } from "../../../site"
import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../../z_vendor/getto-css/preact/layout/app"

import { LoadMenuEntry } from "../../../../outline/action_load_menu/x_preact/load_menu"
import { LoadSeasonEntry } from "./load_season"

import { mockLoadMenuResource } from "../../../../outline/action_load_menu/mock"

import { mockLoadSeasonResource } from "../mock"

export default {
    title: "library/Example/Common/Load Season",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return appLayout({
        siteInfo,
        header: [h(LoadSeasonEntry, mockLoadSeasonResource())],
        main: appMain({
            header: mainHeader([mainTitle("タイトル")]),
            body: mainBody("コンテンツ"),
            copyright,
        }),
        menu: h(LoadMenuEntry, mockLoadMenuResource()),
    })
})

export const LoadSeason = template({})
