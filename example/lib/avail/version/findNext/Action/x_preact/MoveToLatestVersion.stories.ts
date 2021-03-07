import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { initMockFindNextVersionCoreAction } from "../Core/mock"

import { MoveToLatestVersionComponent } from "./MoveToLatestVersion"

import { FindNextVersionCoreActionState } from "../Core/action"

enum FindNextEnum {
    "delayed",
    "failed",
}

export default {
    title: "main/public/Avail/MoveToLatestVersion",
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        findNext: {
            control: { type: "select", options: enumKeys(FindNextEnum) },
        },
    },
}

type MockProps = Readonly<{
    findNext: keyof typeof FindNextEnum
    err: string
}>
const template = storyTemplate<MockProps>((props) => {
    return h(MoveToLatestVersionComponent, {
        findNext: initMockFindNextVersionCoreAction(),
        state: state(),
    })

    function state(): FindNextVersionCoreActionState {
        switch (props.findNext) {
            case "delayed":
                return { type: "delayed-to-find" }

            case "failed":
                return {
                    type: "failed-to-find",
                    err: {
                        type: "failed-to-check",
                        err: { type: "infra-error", err: props.err },
                    },
                }
        }
    }
})

export const Initial = template({ findNext: "delayed", err: "" })
