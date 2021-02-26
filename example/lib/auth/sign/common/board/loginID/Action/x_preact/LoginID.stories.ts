import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { InputLoginIDProps, View } from "./LoginID"

import { initMockInputLoginIDAction } from "../Core/mock"

import { ValidateLoginIDState } from "../Core/action"

enum ValidateEnum {
    "valid",
    "empty",
    "too-long",
}

export default {
    title: "library/Auth/Common/Board/LoginID",
    argTypes: {
        validate: {
            control: { type: "select", options: enumKeys(ValidateEnum) },
        },
    },
}

type Props = Readonly<{
    validate: keyof typeof ValidateEnum
    help: string
}>
const template = storyTemplate<Props>((props) => {
    return h(View, <InputLoginIDProps>{
        field: initMockInputLoginIDAction(),
        help: [props.help],
        state: state(),        
    })

    function state(): ValidateLoginIDState {
        switch (props.validate) {
            case "valid":
                return { valid: true }

            case "empty":
            case "too-long":
                return { valid: false, err: [props.validate] }
        }
    }
})

export const Field = template({ validate: "valid", help: "" })
