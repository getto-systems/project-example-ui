import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../z_vendor/storybook/preact/story"

import { CheckAuthInfoComponent } from "./check_auth_info"

import { mockCheckAuthInfoResource } from "../mock"

import { CheckAuthInfoCoreState } from "../core/action"

enum CheckEnum {
    "delayed",
    "bad-request",
    "server-error",
    "bad-response",
    "infra-error",
}

export default {
    title: "main/public/Auth/Sign/AuthInfo/Check",
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        check: {
            control: { type: "select", options: enumKeys(CheckEnum) },
        },
    },
}

type Props = Readonly<{
    check: keyof typeof CheckEnum
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(CheckAuthInfoComponent, {
        ...mockCheckAuthInfoResource(),
        state: state(),
    })

    function state(): CheckAuthInfoCoreState {
        switch (props.check) {
            case "delayed":
                return { type: "delayed-to-renew" }

            case "bad-request":
                return { type: "failed-to-renew", err: { type: "bad-request" } }

            case "server-error":
                return { type: "failed-to-renew", err: { type: "server-error" } }

            case "bad-response":
                return {
                    type: "failed-to-renew",
                    err: { type: "bad-response", err: props.err },
                }

            case "infra-error":
                return {
                    type: "failed-to-renew",
                    err: { type: "infra-error", err: props.err },
                }
        }
    }
})

export const Check = template({ check: "delayed", err: "" })
