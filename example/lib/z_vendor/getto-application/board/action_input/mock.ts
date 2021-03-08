import { initMockInputBoardValueAction } from "./core/mock"

import { InputBoardValueResource } from "./action"

import { BoardValue } from "../kernel/data"
import { InputBoardValueType } from "../input/data"

export function initMockInputBoardValueResource(
    type: InputBoardValueType,
    value: BoardValue,
): InputBoardValueResource {
    return {
        type,
        input: initMockInputBoardValueAction(value),
    }
}
