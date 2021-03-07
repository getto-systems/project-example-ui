import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../z_vendor/getto-application/action/mock"

import { newMockMoveToNextVersion } from "../../../avail/z_EntryPoint/MoveToNextVersion/mock"

import { NextVersionMockProps } from "../../../avail/x_Resource/MoveToNextVersion/nextVersion/mock"

export default {
    title: "Update/MoveToNextVersion",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = NextVersionMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<NextVersionMockProps>()
    const entryPoint = newMockMoveToNextVersion(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(EntryPoint, entryPoint)
    }
})

export const Delayed = template({ type: "delayed" })
export const Failed = template({ type: "failed", err: "find error" })
