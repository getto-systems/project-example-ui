import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/impl"

import { checkPasswordCharacter } from "../../check_character/impl"

import { InputPasswordAction } from "./action"

import { convertPasswordFromBoard } from "../../convert"

export function initInputPasswordAction(): InputPasswordAction {
    const board = initInputBoardValueResource("password")

    const validate = initValidateBoardFieldAction({
        converter: () => convertPasswordFromBoard(board.input.get()),
    })

    const clear = () => board.input.clear()
    const checkCharacter = () => checkPasswordCharacter(board.input.get())

    board.input.subscribeInputEvent(() => {
        validate.check()
    })

    return {
        board,
        validate,
        clear,
        checkCharacter,
        terminate: () => {
            board.input.terminate()
            validate.terminate()
        },
    }
}
