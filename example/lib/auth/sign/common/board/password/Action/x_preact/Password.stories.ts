import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { InputPasswordProps, View } from "./Password"

import { initMockInputPasswordAction } from "../Core/mock"

import { ValidatePasswordState } from "../Core/action"

import { markBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { PasswordCharacterState } from "../data"

enum ValidateEnum {
    "valid",
    "empty",
    "too-long",
}
enum CharacterEnum {
    "singleByte",
    "multiByte",
}

export default {
    title: "library/Auth/Common/Board/Password",
    argTypes: {
        validate: {
            control: { type: "select", options: enumKeys(ValidateEnum) },
        },
        character: {
            control: { type: "select", options: enumKeys(CharacterEnum) },
        },
    },
}

type Props = Readonly<{
    password: string
    validate: keyof typeof ValidateEnum
    character: keyof typeof CharacterEnum
    help: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, <InputPasswordProps>{
        field: initMockInputPasswordAction(markBoardValue(props.password), characterState()),
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
