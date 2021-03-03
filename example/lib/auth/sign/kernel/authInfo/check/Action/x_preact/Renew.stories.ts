import { h } from "preact"

import { storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { RenewAuthnInfoProps, View } from "./Renew"

import { CheckAuthInfoResourceState } from "../action"
import { initMockRenewAuthnInfoResource } from "../mock"

const renewOptions = {
    delayed: true,
    "bad-request": true,
    "server-error": true,
    "bad-response": true,
    "infra-error": true,
} as const

export default {
    title: "library/Auth/Sign/AuthInfo/Renew",
    argTypes: {
        renew: {
            control: { type: "select", options: Object.keys(renewOptions) },
        },
    },
}

type Props = Readonly<{
    renew: keyof typeof renewOptions
    err: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, <RenewAuthnInfoProps>{
        ...initMockRenewAuthnInfoResource(),
        state: state(),
    })

    function state(): CheckAuthInfoResourceState {
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