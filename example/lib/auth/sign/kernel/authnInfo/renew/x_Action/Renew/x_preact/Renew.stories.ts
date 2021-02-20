import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../../../../x_preact/z_storybook/story"

import { RenewAuthInfo } from "./Renew"

import { initMockPropsPasser } from "../../../../../../../../z_getto/application/mock"
import { initMockRenewAuthnInfoAction, RenewAuthnInfoMockProps } from "../mock"

export default {
    title: "Auth/Sign/AuthInfo/Renew",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = RenewAuthnInfoMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<RenewAuthnInfoMockProps>()
    const action = initMockRenewAuthnInfoAction(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(RenewAuthInfo, {
            resource: { renew: action },
            terminate: () => null,
        })
    }
})

export const Delayed = template({ type: "delayed" })
export const BadRequest = template({ type: "bad-request" })
export const ServerError = template({ type: "server-error" })
export const BadResponse = template({ type: "bad-response", err: "bad response error" })
export const InfraError = template({ type: "infra-error", err: "infra error" })
