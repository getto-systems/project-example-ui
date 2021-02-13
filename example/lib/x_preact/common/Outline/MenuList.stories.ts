import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import {
    appLayout,
    appMain,
    mainHeader,
    mainTitle,
    mainBody,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { copyright, siteInfo } from "../site"

import { MenuList } from "./MenuList"

import { initMockPropsPasser } from "../../../sub/getto-example/Application/mock"
import {
    MenuListMockProps,
    initMockMenuListComponent,
} from "../../../auth/z_EntryPoint/Outline/menuList/mock"

export default {
    title: "Outline/MenuList",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = MenuListMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<MenuListMockProps>()
    const menuList = initMockMenuListComponent(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        const menuProps = { menuList }
        return noPadded(
            appLayout({
                siteInfo: siteInfo(),
                header: [],
                main: appMain({
                    header: mainHeader([mainTitle("タイトル")]),
                    body: mainBody("コンテンツ"),
                    copyright: copyright(),
                }),
                menu: h(MenuList, menuProps),
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
    label: "ホーム",
    badgeCount: 99,
}

export const EmptyNonce = Template.bind({})
EmptyNonce.args = {
    type: "empty-nonce",
}

export const BadRequest = Template.bind({})
BadRequest.args = {
    type: "bad-request",
}

export const ServerError = Template.bind({})
ServerError.args = {
    type: "server-error",
}

export const BadResponse = Template.bind({})
BadResponse.args = {
    type: "bad-response",
    err: "response error",
}

export const InfraError = Template.bind({})
InfraError.args = {
    type: "infra-error",
    err: "infra error",
}
