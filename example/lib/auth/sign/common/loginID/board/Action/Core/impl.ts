import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/impl"

import { InputLoginIDAction } from "./action"

import { convertLoginIDFromBoard } from "../../../convert"

export function initInputLoginIDAction(): InputLoginIDAction {
    const board = initInputBoardValueResource("text")

    const validate = initValidateBoardFieldAction({
        converter: () => convertLoginIDFromBoard(board.input.get()),
    })

    board.input.subscribeInputEvent(() => validate.check())

    return {
        board,
        validate,
        clear: () => board.input.clear(),
        terminate: () => {
            board.input.terminate()
            validate.terminate()
        },
    }
}
