import { h } from "preact"

import { storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { LoginIDBoardFieldProps, View } from "./LoginID"

import { initMockLoginIDBoardFieldAction } from "../mock"

import { ValidateLoginIDState } from "../action"

const typeOptions = ["valid", "empty", "too-long"] as const

export default {
    title: "library/Auth/Common/Board/LoginID",
    argTypes: {
        validate: {
            control: { type: "select", options: typeOptions },
        },
    },
}

type Props = Readonly<{ validate: "valid" | "empty" | "too-long"; help: string }>
const template = storyTemplate<Props>((props) => {
    return h(View, <LoginIDBoardFieldProps>{
        field: initMockLoginIDBoardFieldAction(),
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
