import { h } from "preact"
import { useEffect } from "preact/hooks"
import { storyTemplate } from "../../../../../../../x_preact/z_storybook/story"
import { initMockPropsPasser } from "../../../../../getto-example/Application/mock"
import { InputBoardValueType, inputBoardValueTypes } from "../../../data"
import { initMockInputBoardValueAction, InputBoardMockProps } from "../mock"
import { InputBoard } from "./Input"

export default {
    title: "Common/Vendor/GettoBoard/Input",
    argTypes: {
        type: {
            table: { disable: true },
        },
        inputType: {
            control: { type: "select", options: inputBoardValueTypes },
        },
    },
}

type MockProps = InputBoardMockProps & Readonly<{ inputType: InputBoardValueType }>
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<InputBoardMockProps>()
    const action = initMockInputBoardValueAction(passer, args.inputType)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(InputBoard, { input: action, onChange: () => null })
    }
})

export const Initial = template({ type: "initial", inputType: "text", value: "" })
