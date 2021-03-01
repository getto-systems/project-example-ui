import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/impl"

import { checkPasswordCharacter } from "../../checkCharacter/impl"

import { InputPasswordAction } from "./action"

import { convertPasswordFromBoard } from "../../../../password/convert"

export function initInputPasswordAction(): InputPasswordAction {
    const resource = initInputBoardValueResource("password")

    const validate = initValidateBoardFieldAction({
        converter: () => convertPasswordFromBoard(resource.input.get()),
    })

    const clear = () => resource.input.clear()
    const checkCharacter = () => checkPasswordCharacter(resource.input.get())

    resource.input.subscribeInputEvent(() => {
        validate.check()
    })

    return {
        resource,
        validate,
        clear,
        checkCharacter,
        terminate: () => {
            resource.input.terminate()
            validate.terminate()
        },
    }
}
