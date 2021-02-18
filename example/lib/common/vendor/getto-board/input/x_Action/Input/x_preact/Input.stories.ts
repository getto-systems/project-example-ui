import { h } from "preact"
import { useEffect } from "preact/hooks"
import { storyTemplate } from "../../../../../../../x_preact/z_storybook/story"
import { initMockPropsPasser } from "../../../../../getto-example/Application/mock"
import { initMockInputBoardAction, InputBoardMockProps } from "../mock"
import { InputBoard, InputBoardType, inputBoardTypes } from "./Input"

export default {
    title: "common/vendor/getto-board/Input",
    argTypes: {
        type: {
            table: { disable: true },
        },
        inputType: {
            control: { type: "select", options: inputBoardTypes },
        },
    },
}

type MockProps = InputBoardMockProps & Readonly<{ inputType: InputBoardType }>
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<InputBoardMockProps>()
    const action = initMockInputBoardAction(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(InputBoard, { type: props.args.inputType, input: action, onChange: () => null })
    }
})

export const Initial = template({ type: "initial", inputType: "text", value: "" })
