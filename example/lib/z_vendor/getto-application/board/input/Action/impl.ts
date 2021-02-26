import { initInputBoardValueAction, initMockInputBoardValueAction } from "./Core/impl"

import { InputBoardValueResource } from "./action"

import { InputBoardValueType } from "../data"
import { BoardValue } from "../../kernel/data"

export function initInputBoardValueResource(type: InputBoardValueType): InputBoardValueResource {
    return {
        type,
        input: initInputBoardValueAction(),
    }
}

export function initMockInputBoardValueResource(
    type: InputBoardValueType,
    value: BoardValue,
): InputBoardValueResource {
    return {
        type,
        input: initMockInputBoardValueAction(value),
    }
}
