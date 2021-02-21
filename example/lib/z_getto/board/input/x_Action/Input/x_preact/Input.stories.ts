import { h } from "preact"

import { storyTemplate } from "../../../../../../z_vendor/storybook/preact/story"

import { InputBoard, InputBoardProps } from "./Input"

import { initMockInputBoardValueAction } from "../mock"

import { markBoardValue } from "../../../../kernel/data"
import { InputBoardValueType, inputBoardValueTypes } from "../../../data"

export default {
    title: "Getto/Board/Input",
    argTypes: {
        inputType: {
            control: { type: "select", options: inputBoardValueTypes },
        },
    },
}

type Props = Readonly<{
    inputType: InputBoardValueType
    value: string
}>
const template = storyTemplate<Props>((props) => {
    return h(InputBoard, <InputBoardProps>{
        type: props.inputType,
        input: initMockInputBoardValueAction(markBoardValue(props.value)),
    })
})

export const Initial = template({ inputType: "text", value: "" })
