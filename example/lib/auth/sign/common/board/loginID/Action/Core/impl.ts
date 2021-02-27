import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/impl"

import { InputLoginIDAction } from "./action"

import { convertLoginIDFromBoardValue } from "../../../../loginID/data"

export function initInputLoginIDAction(): InputLoginIDAction {
    const resource = initInputBoardValueResource("text")

    const validate = initValidateBoardFieldAction({
        converter: () => convertLoginIDFromBoardValue(resource.input.get()),
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
