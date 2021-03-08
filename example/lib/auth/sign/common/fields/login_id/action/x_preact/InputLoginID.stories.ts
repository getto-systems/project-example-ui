import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { InputLoginIDComponent } from "./InputLoginID"

import { initMockInputLoginIDAction } from "../core/mock"

import { LOGIN_ID_MAX_LENGTH } from "../../convert"

import { ValidateLoginIDState } from "../core/action"

enum ValidateEnum {
    "valid",
    "empty",
    "too-long",
}

export default {
    title: "library/Auth/Common/Fields/InputLoginID",
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
    return h(InputLoginIDComponent, {
        field: initMockInputLoginIDAction(),
        help: [props.help],
        state: state(),
    })

    function state(): ValidateLoginIDState {
        switch (props.validate) {
            case "valid":
                return { valid: true }

            case "empty":
                return { valid: false, err: [{ type: props.validate }] }

            case "too-long":
                return {
                    valid: false,
                    err: [{ type: props.validate, maxLength: LOGIN_ID_MAX_LENGTH }],
                }
        }
    }
})

export const Field = template({ validate: "valid", help: "" })
