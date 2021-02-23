import { h } from "preact"

import { storyTemplate } from "../../../../../../../../z_vendor/storybook/preact/story"

import { PasswordBoardFieldProps, View } from "./Password"

import { initMockPasswordBoardFieldAction } from "../mock"

import { ValidatePasswordState } from "../action"

import { markBoardValue } from "../../../../../../../../z_getto/board/kernel/data"
import { PasswordCharacterState } from "../data"

const typeOptions = ["valid", "empty", "too-long"] as const
const characterOptions = ["singleByte", "multiByte"] as const

export default {
    title: "library/Auth/Common/Board/Password",
    argTypes: {
        validate: {
            control: { type: "select", options: typeOptions },
        },
        character: {
            control: { type: "select", options: characterOptions },
        },
    },
}

type Props = Readonly<{
    password: string
    validate: "valid" | "empty" | "too-long"
    character: "singleByte" | "multiByte"
    help: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, <PasswordBoardFieldProps>{
        field: initMockPasswordBoardFieldAction(markBoardValue(props.password), characterState()),
        help: [props.help],
        state: validateState(),
    })

    function validateState(): ValidatePasswordState {
        switch (props.validate) {
            case "valid":
                return { valid: true }

            case "empty":
            case "too-long":
                return { valid: false, err: [props.validate] }
        }
    }
    function characterState(): PasswordCharacterState {
        return { multiByte: props.character === "multiByte" }
    }
})

export const Field = template({
    password: "",
    validate: "valid",
    character: "singleByte",
    help: "",
})
