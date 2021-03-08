import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { InputPasswordComponent } from "./InputPassword"

import { markBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/test_helper"

import { initMockInputPasswordAction } from "../core/mock"

import { PASSWORD_MAX_BYTES } from "../../convert"

import { ValidatePasswordState } from "../core/action"

import { PasswordCharacterState } from "../../data"

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
    title: "library/Auth/Common/Fields/InputPassword",
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
    return h(InputPasswordComponent, {
        field: initMockInputPasswordAction(markBoardValue(props.password), characterState()),
        help: [props.help],
        state: validateState(),
    })

    function validateState(): ValidatePasswordState {
        switch (props.validate) {
            case "valid":
                return { valid: true }

            case "empty":
                return { valid: false, err: [{ type: props.validate }] }

            case "too-long":
                return {
                    valid: false,
                    err: [
                        { type: props.validate, maxBytes: PASSWORD_MAX_BYTES, ...characterState() },
                    ],
                }
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