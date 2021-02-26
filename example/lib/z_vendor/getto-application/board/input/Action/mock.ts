import { initMockInputBoardValueAction } from "./Core/mock"

import { InputBoardValueResource } from "./action"

import { BoardValue } from "../../kernel/data"
import { InputBoardValueType } from "../data"

export function initMockInputBoardValueResource(
    type: InputBoardValueType,
    value: BoardValue,
): InputBoardValueResource {
    return {
        type,
        input: initMockInputBoardValueAction(value),
    }
}
