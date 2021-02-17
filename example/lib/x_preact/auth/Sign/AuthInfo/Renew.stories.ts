import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_storybook/story"

import { RenewAuthInfo } from "./Renew"

import { initMockPropsPasser } from "../../../../common/vendor/getto-example/Application/mock"
import { initMockRenewCredentialEntryPoint } from "../../../../auth/z_EntryPoint/Sign/mock"

import { RenewAuthInfoMockProps } from "../../../../auth/x_Resource/Sign/AuthInfo/Renew/mock"

export default {
    title: "Auth/Sign/AuthInfo/Renew",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = RenewAuthInfoMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<RenewAuthInfoMockProps>()
    const entryPoint = initMockRenewCredentialEntryPoint(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(RenewAuthInfo, entryPoint)
    }
})

export const Delayed = template({ type: "delayed" })
export const BadRequest = template({ type: "bad-request" })
export const ServerError = template({ type: "server-error" })
export const BadResponse = template({ type: "bad-response", err: "bad response error" })
export const InfraError = template({ type: "infra-error", err: "infra error" })
