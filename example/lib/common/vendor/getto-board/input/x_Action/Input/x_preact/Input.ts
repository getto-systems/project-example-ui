import { html } from "htm/preact"
import { VNode } from "preact"

import { useAction } from "../../../../../../../x_preact/common/hooks"

import { initialInputBoardState, InputBoardResource } from "../action"

import { markBoardValue } from "../../../../kernel/data"

export type InputBoardProps = InputBoardResource
export function InputBoard(resource: InputBoardProps): VNode {
    const state = useAction(resource.input, initialInputBoardState)

    return html`<input type=${resource.input.type} value=${state.value} onInput=${onInput} />`

    function onInput(event: InputEvent) {
        if (event.target instanceof HTMLInputElement) {
            resource.input.set(markBoardValue(event.target.value))
        }
    }
}
