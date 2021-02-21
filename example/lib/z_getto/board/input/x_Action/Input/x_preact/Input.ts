import { VNode } from "preact"
import { useLayoutEffect, useRef } from "preact/hooks"
import { html } from "htm/preact"

import { InputBoardValueResource } from "../action"

import { BoardValue, emptyBoardValue, markBoardValue } from "../../../../kernel/data"

export type InputBoardProps = InputBoardValueResource
export function InputBoard(props: InputBoardProps): VNode {
    const REF = useRef<HTMLInputElement>()
    useLayoutEffect(() => {
        props.input.linkStore({
            get,
            set,
        })
    }, [])
    return html`<input ref=${REF} type=${props.type} onInput=${onInput} />`

    function onInput() {
        props.input.triggerInputEvent()
    }

    function get() {
        if (!REF.current) {
            return emptyBoardValue
        }
        return markBoardValue(REF.current.value)
    }
    function set(value: BoardValue) {
        if (REF.current) {
            REF.current.value = value
        }
    }
}
