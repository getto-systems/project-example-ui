import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../storybook/preact/story"

import { InputBoard, InputBoardProps } from "./Input"

import { initMockInputBoardValueAction } from "../Core/impl"

import { markBoardValue } from "../../../kernel/data"
import { InputBoardValueType, InputBoardValueTypeEnum } from "../../data"

export default {
    title: "Getto/Board/Input",
    argTypes: {
        inputType: {
            control: { type: "select", options: enumKeys(InputBoardValueTypeEnum) },
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
