import { h } from "preact"
import { storyTemplate } from "../../../../../../z_vendor/storybook/preact/story"
import { markBoardValue } from "../../../../kernel/data"
import { InputBoardValueType, inputBoardValueTypes } from "../../../data"
import { InputBoardValueState } from "../action"
import { initMockInputBoardValueAction } from "../mock"
import { View } from "./Input"

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
    return h(View, {
        type: props.inputType,
        input: initMockInputBoardValueAction(),
        state: state(),
    })

    function state(): InputBoardValueState {
        return markBoardValue(props.value)
    }
})

export const Initial = template({ inputType: "text", value: "" })
