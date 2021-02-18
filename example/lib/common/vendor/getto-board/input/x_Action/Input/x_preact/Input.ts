import { html } from "htm/preact"
import { VNode } from "preact"

import { useAction } from "../../../../../../../x_preact/common/hooks"

import { initialInputBoardState, InputBoardResource } from "../action"

import { markBoardValue } from "../../../../kernel/data"

export const inputBoardTypes = [
    "text",
    "password",
    "search",
    "number",
    "tel",
    "email",
    "date",
    "time",
] as const
function inputBoardTypes_item() {
    return inputBoardTypes.find(() => true) || inputBoardTypes[0]
}
export type InputBoardType = ReturnType<typeof inputBoardTypes_item>

export type InputBoardProps = InputBoardResource &
    Readonly<{
        type: InputBoardType
        onChange: { (): void }
    }>
export function InputBoard(resource: InputBoardProps): VNode {
    const state = useAction(resource.input, initialInputBoardState)

    return html`<input
        type=${resource.type}
        value=${state.value}
        onInput=${onInput}
        onChange=${onChange}
    />`

    function onInput(event: InputEvent) {
        if (event.target instanceof HTMLInputElement) {
            resource.input.set(markBoardValue(event.target.value))
        }
    }
    function onChange() {
        resource.onChange()
    }
}
