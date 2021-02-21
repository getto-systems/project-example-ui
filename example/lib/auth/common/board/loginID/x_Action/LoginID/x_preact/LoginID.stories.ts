import { h } from "preact"

import { storyTemplate } from "../../../../../../../z_vendor/storybook/preact/story"

import { View } from "./LoginID"

import { initMockLoginIDBoardFieldAction } from "../mock"
import { ValidateLoginIDState } from "../action"

export default {
    title: "Auth/Common/Board/LoginID",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type Props =
    | Readonly<{ type: "valid"; help: string }>
    | Readonly<{ type: "empty"; help: string }>
    | Readonly<{ type: "too-long"; help: string }>

const template = storyTemplate<Props>((props) => {
    const action = initMockLoginIDBoardFieldAction()
    return h(View, {
        field: action,
        help: [props.help],
        state: state(),
    })

    function state(): ValidateLoginIDState {
        switch (props.type) {
            case "valid":
                return { valid: true }

            case "empty":
            case "too-long":
                return { valid: false, err: [props.type] }
        }
    }
})

const defaultArgs = {
    help: "",
} as const

export const Valid = template({ ...defaultArgs, type: "valid" })
export const Empty = template({ ...defaultArgs, type: "empty" })
export const TooLong = template({ ...defaultArgs, type: "too-long" })
