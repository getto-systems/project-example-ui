import { h, VNode } from "preact"
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

import { initMenuListComponent } from "../../auth/Outline/menuList/mock"
import {
    mapSeasonMockProps,
    SeasonMockProps,
    initSeasonInfoComponent,
} from "../../example/Outline/seasonInfo/mock"

import { initialMenuListState } from "../../auth/Outline/menuList/component"
import { initialSeasonInfoState } from "../../example/Outline/seasonInfo/component"

export default {
    title: "Outline/SeasonInfo",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = SeasonMockProps
const Template: Story<MockProps> = (args) => {
    const menuList = initMenuListComponent(initialMenuListState)
    const seasonInfo = initSeasonInfoComponent(initialSeasonInfoState)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        seasonInfo.update(mapSeasonMockProps(props.args))
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
