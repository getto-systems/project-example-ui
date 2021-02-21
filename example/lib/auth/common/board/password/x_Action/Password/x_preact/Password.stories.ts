import { h } from "preact"

import { storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { View } from "./Password"

import { initMockPasswordBoardFieldAction } from "../mock"

import { TogglePasswordDisplayBoardState, ValidatePasswordState } from "../action"

import { markBoardValue } from "../../../../../../../z_getto/board/kernel/data"
import { PasswordCharacterState } from "../data"

const typeOptions = ["valid", "empty", "too-long"] as const
const displayOptions = ["hide", "show"] as const
const characterOptions = ["singleByte", "multiByte"] as const

export default {
    title: "Auth/Common/Board/Password",
    argTypes: {
        validate: {
            control: { type: "select", options: typeOptions },
        },
        display: {
            control: { type: "select", options: displayOptions },
        },
        character: {
            control: { type: "select", options: characterOptions },
        },
    },
}

type Props = Readonly<{
    password: string
    validate: "valid" | "empty" | "too-long"
    display: "hide" | "show"
    character: "singleByte" | "multiByte"
    help: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, {
        field: initMockPasswordBoardFieldAction(markBoardValue(props.password), characterState()),
        help: [props.help],
        state: {
            validate: validateState(),
            toggle: toggleState(),
        },
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
    function toggleState(): TogglePasswordDisplayBoardState {
        switch (props.display) {
            case "show":
                return { visible: true }

            case "hide":
                return { visible: false }
        }
    }
    function characterState(): PasswordCharacterState {
        return { multiByte: props.character === "multiByte" }
    }
})

export const Field = template({
    password: "",
    validate: "valid",
    display: "hide",
    character: "singleByte",
    help: "",
})
