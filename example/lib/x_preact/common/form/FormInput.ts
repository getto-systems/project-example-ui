import { html } from "htm/preact"
import { VNode } from "preact"
import {
    FormInputComponent,
    initialFormInputComponentState,
} from "../../../sub/getto-form/component/component"
import { markInputString } from "../../../sub/getto-form/data"
import { useComponent } from "../hooks"

export type FormInputProps = Readonly<{
    type: FormInputType
    input: FormInputComponent
}>
type FormInputType = "text" | "password" | "search" | "number" | "tel" | "email" | "date" | "time"

export function FormInput({ type, input }: FormInputProps): VNode {
    const state = useComponent(input, initialFormInputComponentState)

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
