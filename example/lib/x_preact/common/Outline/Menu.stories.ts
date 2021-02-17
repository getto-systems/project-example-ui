import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../z_storybook/story"
import { noPaddedStory } from "../../z_storybook/display"

import {
    appLayout,
    appMain,
    mainHeader,
    mainTitle,
    mainBody,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { copyright, siteInfo } from "../site"

import { Menu } from "./Menu"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
import {
    MenuMockProps,
    initMockMenuComponent,
} from "../../../common/x_Resource/Outline/Menu/Menu/mock"

export default {
    title: "Outline/Menu",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = MenuMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<MenuMockProps>()
    const menu = initMockMenuComponent(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        const menuProps = { menu }
        return noPaddedStory(
            appLayout({
                siteInfo: siteInfo(),
                header: [],
                main: appMain({
                    header: mainHeader([mainTitle("タイトル")]),
                    body: mainBody("コンテンツ"),
                    copyright: copyright(),
                }),
                menu: h(Menu, menuProps),
            })
        )
    }
})

export const Success = template({ type: "success", label: "ホーム", badgeCount: 99 })
export const EmptyNonce = template({ type: "empty-nonce" })
export const BadRequest = template({ type: "bad-request" })
export const ServerError = template({ type: "server-error" })
export const BadResponse = template({ type: "bad-response", err: "response error" })
export const InfraError = template({ type: "infra-error", err: "infra error" })
