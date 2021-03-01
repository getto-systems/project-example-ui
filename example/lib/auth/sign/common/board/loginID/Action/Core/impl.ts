import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/impl"

import { InputLoginIDAction } from "./action"

import { convertLoginIDFromBoard } from "../../../../loginID/convert"

export function initInputLoginIDAction(): InputLoginIDAction {
    const resource = initInputBoardValueResource("text")

    const validate = initValidateBoardFieldAction({
        converter: () => convertLoginIDFromBoard(resource.input.get()),
    })

    resource.input.subscribeInputEvent(() => validate.check())

    return {
        resource,
        validate,
        clear: () => resource.input.clear(),
        terminate: () => {
            resource.input.terminate()
            validate.terminate()
        },
    }
}
