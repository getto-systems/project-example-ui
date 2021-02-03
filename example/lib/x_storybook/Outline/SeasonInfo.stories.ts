import { h, VNode } from "preact"
import { html } from "htm/preact"

import { siteInfo } from "../../x_preact/common/site"
import {
    appLayout,
    appMain,
    appMenu,
    mainBody,
    mainHeader,
    mainTitle,
    menuFooter,
    menuHeader,
} from "../../z_vendor/getto-css/preact/layout/app"

import { SeasonInfo } from "../../x_preact/Outline/SeasonInfo"

import {
    mapSeasonMockProps,
    SeasonMockProps,
    initSeasonInfoComponent,
} from "../../example/Outline/seasonInfo/mock"

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
                main: appMain({
                    header: mainHeader([mainTitle("タイトル")]),
                    body: mainBody("コンテンツ"),
                }),
                menu: appMenu([menuHeader(siteInfo()), h(SeasonInfo, { seasonInfo }), menuFooter()]),
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
