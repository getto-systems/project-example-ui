import { html } from "htm/preact"
import { VNode } from "preact"

import { useComponent } from "../hooks"

import {
    FormInputComponent,
    initialFormInputState,
} from "../../../sub/getto-form/component/component"

import { markInputString } from "../../../sub/getto-form/action/data"

export type FormInputProps = Readonly<{
    type: FormInputType
    input: FormInputComponent
}>
type FormInputType = "text" | "password" | "search" | "number" | "tel" | "email" | "date" | "time"

export function FormInput({ type, input }: FormInputProps): VNode {
    const state = useComponent(input, initialFormInputState)

    return html`<input type=${type} value=${state.value} onInput=${onInput} onChange=${onChange} />`

    function onInput(event: InputEvent) {
        if (event.target instanceof HTMLInputElement) {
            input.input(markInputString(event.target.value))
        }
    }
    function onChange() {
        input.change()
    }
}
