import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../../../x_preact/z_storybook/story"

import { LoginIDBoard } from "./LoginID"

import { initMockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"
import { LoginIDBoardMockProps, initMockLoginIDBoardFieldAction } from "../mock"

export default {
    title: "Auth/Common/Board/LoginID",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type Props = LoginIDBoardMockProps & { help: string }
const template = storyTemplate<Props>((args) => {
    const passer = initMockPropsPasser<LoginIDBoardMockProps>()
    const action = initMockLoginIDBoardFieldAction(passer)
    return h(Preview, { args })

    function Preview(props: { args: Props }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(LoginIDBoard, { field: action, help: [args.help] })
    }
})

const defaultArgs = {
    help: "",
} as const

export const Valid = template({ ...defaultArgs, type: "valid" })
export const Empty = template({ ...defaultArgs, type: "empty" })
export const TooLong = template({ ...defaultArgs, type: "too-long" })
