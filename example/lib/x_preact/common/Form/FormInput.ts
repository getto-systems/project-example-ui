import { html } from "htm/preact"
import { VNode } from "preact"

import { useApplicationAction } from "../hooks"

import {
    FormInputComponent,
    initialFormInputComponentState,
} from "../../../z_getto/getto-form/x_Resource/Form/component"

import { markInputString } from "../../../z_getto/getto-form/form/data"

type FormInputType = "text" | "password" | "search" | "number" | "tel" | "email" | "date" | "time"

export type FormInputProps = Readonly<{
    type: FormInputType
    input: FormInputComponent
}>
export function FormInput(resource: FormInputProps): VNode {
    const state = useApplicationAction(resource.input, initialFormInputComponentState)

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
