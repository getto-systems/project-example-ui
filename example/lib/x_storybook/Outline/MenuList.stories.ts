import { h, VNode } from "preact"
import { html } from "htm/preact"

import {
    appLayout,
    appMain,
    mainHeader,
    mainTitle,
    mainBody,
} from "../../z_vendor/getto-css/preact/layout/app"

import { copyright, siteInfo } from "../../x_preact/common/site"

import { MenuList } from "../../x_preact/Outline/MenuList"

import { mapMenuMockProps, MenuMockProps, initMenuListComponent } from "../../auth/Outline/menuList/mock"

import { initialMenuListState } from "../../auth/Outline/menuList/component"

export default {
    title: "Outline/MenuList",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = MenuMockProps
const Template: Story<MockProps> = (args) => {
    const menuList = initMenuListComponent(initialMenuListState)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        menuList.update(mapMenuMockProps(props.args))
        const menuProps = { menuList }
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
                header: [],
                main: appMain({
                    header: mainHeader([mainTitle("タイトル")]),
                    body: mainBody("コンテンツ"),
                    copyright: copyright(),
                }),
                menu: h(MenuList, menuProps),
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
