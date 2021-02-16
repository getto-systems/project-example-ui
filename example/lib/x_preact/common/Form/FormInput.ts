import { html } from "htm/preact"
import { VNode } from "preact"

import { useAction } from "../hooks"

import {
    FormInputComponent,
    initialFormInputComponentState,
} from "../../../common/vendor/getto-form/x_Resource/Form/component"

import { markInputString } from "../../../common/vendor/getto-form/form/data"

type FormInputType = "text" | "password" | "search" | "number" | "tel" | "email" | "date" | "time"

export type FormInputProps = Readonly<{
    type: FormInputType
    input: FormInputComponent
}>
export function FormInput(resource: FormInputProps): VNode {
    const state = useAction(resource.input, initialFormInputComponentState)

    return html`<input
        type=${resource.type}
        value=${state.value}
        onInput=${onInput}
        onChange=${onChange}
    />`

    function onInput(event: InputEvent) {
        if (event.target instanceof HTMLInputElement) {
            resource.input.input(markInputString(event.target.value))
        }
    }
    function onChange() {
        resource.input.change()
    }
}
