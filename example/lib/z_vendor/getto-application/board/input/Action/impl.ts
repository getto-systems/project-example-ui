import { initInputBoardValueAction } from "./Core/impl"

import { InputBoardValueResource } from "./action"

import { InputBoardValueType } from "../data"

export function initInputBoardValueResource(type: InputBoardValueType): InputBoardValueResource {
    return {
        type,
        input: initInputBoardValueAction(),
    }
}
