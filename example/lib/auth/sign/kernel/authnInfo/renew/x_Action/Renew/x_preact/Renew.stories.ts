import { h } from "preact"

import { storyTemplate } from "../../../../../../../../z_vendor/storybook/preact/story"

import { RenewAuthnInfoProps, View } from "./Renew"

import { initMockRenewAuthnInfoAction } from "../mock"

import { RenewAuthnInfoState } from "../action"

const renewOptions = [
    "delayed",
    "bad-request",
    "server-error",
    "bad-response",
    "infra-error",
] as const

export default {
    title: "library/Auth/Sign/AuthInfo/Renew",
    argTypes: {
        renew: {
            control: { type: "select", options: renewOptions },
        },
    },
}

type Props = Readonly<{
    renew: "delayed" | "bad-request" | "server-error" | "bad-response" | "infra-error"
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, <RenewAuthnInfoProps>{
        renew: initMockRenewAuthnInfoAction(),
        state: state(),
    })

    function state(): RenewAuthnInfoState {
        switch (props.renew) {
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

export const Box = template({ renew: "delayed", err: "" })
