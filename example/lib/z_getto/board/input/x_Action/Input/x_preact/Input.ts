import { html } from "htm/preact"
import { VNode } from "preact"

import { useApplicationAction } from "../../../../../../x_preact/common/hooks"

import { initialInputBoardState, InputBoardValueResource } from "../action"

import { markBoardValue } from "../../../../kernel/data"

export type InputBoardProps = InputBoardValueResource
export function InputBoard(resource: InputBoardProps): VNode {
    const state = useApplicationAction(resource.input, initialInputBoardState)

    return html`<input type=${resource.type} value=${state} onInput=${onInput} />`

    function onInput(event: InputEvent) {
        if (event.target instanceof HTMLInputElement) {
            resource.input.set(markBoardValue(event.target.value))
        }
    }
}
