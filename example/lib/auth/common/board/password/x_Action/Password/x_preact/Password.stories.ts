import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../../../x_preact/z_storybook/story"

import { PasswordBoard } from "./Password"

import { initMockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"
import {
    initMockPasswordBoardResource,
    PasswordBoardResourceMockProps,
    passwordCharacterStateTypes,
    passwordDisplayBoardTypes,
} from "../mock"

export default {
    title: "Auth/Common/Board/Password",
    argTypes: {
        type: {
            table: { disable: true },
        },
        display: {
            control: { type: "select", options: passwordDisplayBoardTypes },
        },
        character: {
            control: { type: "select", options: passwordCharacterStateTypes },
        },
    },
}

type Props = PasswordBoardResourceMockProps & { help: string }
const template = storyTemplate<Props>((args) => {
    const passer = initMockPropsPasser<PasswordBoardResourceMockProps>()
    const resource = initMockPasswordBoardResource(passer)
    return h(Preview, { args })

    function Preview(props: { args: Props }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(PasswordBoard, { ...resource, help: [args.help] })
    }
})

const defaultArgs = {
    help: "",
    display: "hide",
    character: "singleByte",
} as const

export const Valid = template({ ...defaultArgs, type: "valid" })
export const Empty = template({ ...defaultArgs, type: "empty" })
export const TooLong = template({ ...defaultArgs, type: "too-long" })
