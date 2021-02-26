import { VNode } from "preact"
import { useLayoutEffect, useRef } from "preact/hooks"
import { html } from "htm/preact"

import { InputBoardValueAction, InputBoardValueResource } from "../action"

import { BoardValue, emptyBoardValue, markBoardValue } from "../../../../kernel/data"

export type InputBoardProps = InputBoardValueResource
export function InputBoard(props: InputBoardProps): VNode {
    return html`<input
        ref=${useBoardValueStore(props.input)}
        type=${props.type}
        onInput=${onInput}
    />`

    function onInput() {
        props.input.triggerInputEvent()
    }
}

function useBoardValueStore(input: InputBoardValueAction) {
    const REF = useRef<HTMLInputElement>()
    useLayoutEffect(() => {
        input.linkStore({
            get,
            set,
        })
    }, [])

    return REF

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
