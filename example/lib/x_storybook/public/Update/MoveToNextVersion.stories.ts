import { h, VNode } from "preact"

import { newMoveToNextVersion } from "../../../update/Update/MoveToNextVersion/mock"
import { mapNextVersionMockProps, NextVersionMockProps } from "../../../update/Update/nextVersion/mock"

import { MoveToLatestVersion } from "../../../x_preact/public/Update/MoveToLatestVersion"

export default {
    title: "public/Update/MoveToNextVersion",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = NextVersionMockProps
const Template: Story<MockProps> = (args) => {
    const { moveToNextVersion, update } = newMoveToNextVersion()
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        update.nextVersion(mapNextVersionMockProps(props.args))
        return h(MoveToLatestVersion, { moveToNextVersion })
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
