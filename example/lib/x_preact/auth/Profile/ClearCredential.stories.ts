import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { ClearCredential } from "./ClearCredential"

import { initMockPropsPasser } from "../../../common/getto-example/Application/mock"
import {
    ClearCredentialResourceMockProps,
    initMockClearCredentialResource,
} from "../../../auth/x_Resource/Sign/ClearCredential/mock"

export default {
    title: "Auth/Profile/ClearCredential",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = ClearCredentialResourceMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<ClearCredentialResourceMockProps>()
    const resource = initMockClearCredentialResource(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(ClearCredential, resource)
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Failed = Template.bind({})
Failed.args = {
    type: "failed",
    err: "logout error",
}
