import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { CheckAuthTicketComponent } from "./check_auth_info"

import { mockCheckAuthTicketResource } from "../mock"

import { CheckAuthTicketCoreState } from "../core/action"

enum CheckEnum {
    "takeLongtime",
    "bad-request",
    "server-error",
    "bad-response",
    "infra-error",
}

export default {
    title: "main/public/Auth/Sign/AuthTicket/Check",
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
    return h(CheckAuthTicketComponent, {
        ...mockCheckAuthTicketResource(),
        state: state(),
    })

    function state(): CheckAuthTicketCoreState {
        switch (props.check) {
            case "takeLongtime":
                return { type: "take-longtime-to-renew" }

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

export const Check = template({ check: "takeLongtime", err: "" })
