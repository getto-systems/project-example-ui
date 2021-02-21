import { html } from "htm/preact"
import { h, VNode } from "preact"

import { useApplicationAction } from "../../../../../../x_preact/common/hooks"

import { initialInputBoardState, InputBoardValueResource, InputBoardValueState } from "../action"

import { markBoardValue } from "../../../../kernel/data"

export function InputBoard(resource: InputBoardValueResource): VNode {
    return h(View, <InputBoardProps>{
        ...resource,
        state: useApplicationAction(resource.input, initialInputBoardState),
    })
}

export type InputBoardProps = InputBoardValueResource & Readonly<{ state: InputBoardValueState }>
export function View(props: InputBoardProps): VNode {
    return html`<input type=${props.type} value=${props.state} onInput=${onInput} />`

    function onInput(event: InputEvent) {
        if (event.target instanceof HTMLInputElement) {
            props.input.set(markBoardValue(event.target.value))
        }
    }
}
