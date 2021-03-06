import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { CheckPasswordResetSendingStatusComponent } from "./check_reset_token_sending_status"

import { mockCheckResetTokenSendingStatusResource } from "../mock"

import { CheckResetTokenSendingStatusCoreState } from "../core/action"

enum CheckStatusEnum {
    "initial",
    "check",
    "waiting",
    "sending",
    "invalid",
    "server-error",
    "infra-error",
    "send-error",
    "send",
}

export default {
    title: "main/public/Auth/Sign/Password/Reset/Check Status",
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        checkStatus: {
            control: { type: "select", options: enumKeys(CheckStatusEnum) },
        },
    },
}

type Props = Readonly<{
    checkStatus: keyof typeof CheckStatusEnum
    err: string
}>
const template = storyTemplate<Props>((props) => {
    const resource = mockCheckResetTokenSendingStatusResource()
    return h(CheckPasswordResetSendingStatusComponent, {
        ...resource,
        state: state(),
    })

    function state(): CheckResetTokenSendingStatusCoreState {
        switch (props.checkStatus) {
            case "initial":
                return { type: "initial-check-status" }

            case "check":
                return { type: "try-to-check-status" }

            case "waiting":
                return {
                    type: "retry-to-check-status",
                    status: { sending: false },
                }

            case "sending":
                return {
                    type: "retry-to-check-status",
                    status: { sending: true },
                }

            case "invalid":
                return {
                    type: "failed-to-check-status",
                    err: { type: "invalid-reset" },
                }

            case "server-error":
                return {
                    type: "failed-to-check-status",
                    err: { type: "server-error" },
                }

            case "infra-error":
                return {
                    type: "failed-to-check-status",
                    err: { type: "infra-error", err: props.err },
                }

            case "send-error":
                return {
                    type: "failed-to-send-token",
                    err: { type: "infra-error", err: props.err },
                }

            case "send":
                return { type: "succeed-to-send-token" }
        }
    }
})

export const CheckStatus = template({
    checkStatus: "initial",
    err: "",
})
