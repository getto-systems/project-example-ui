import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/impl"

import { ValidateBoardInfra } from "../../../../../../../z_vendor/getto-application/board/kernel/infra"

import { InputLoginIDAction } from "./action"

import { convertLoginID } from "../../../../loginID/data"

export function initInputLoginIDAction(infra: ValidateBoardInfra): InputLoginIDAction {
    const resource = initInputBoardValueResource("text")

    const validate = initValidateBoardFieldAction(
        {
            name: "loginID",
            getter: () => resource.input.get(),
            converter: convertLoginID,
        },
        infra,
    )

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
