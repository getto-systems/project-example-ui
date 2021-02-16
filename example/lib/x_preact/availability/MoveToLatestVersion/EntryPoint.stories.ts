import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"

import { newMockMoveToNextVersion } from "../../../availability/z_EntryPoint/MoveToNextVersion/mock"
import { NextVersionMockProps } from "../../../availability/x_Resource/MoveToNextVersion/nextVersion/mock"

import { EntryPoint } from "./EntryPoint"

export default {
    title: "Update/MoveToNextVersion",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = NextVersionMockProps
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<NextVersionMockProps>()
    const entryPoint = newMockMoveToNextVersion(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(EntryPoint, entryPoint)
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Delayed = Template.bind({})
Delayed.args = {
    type: "delayed",
}

export const Failed = Template.bind({})
Failed.args = {
    type: "failed",
    err: "find error",
}
