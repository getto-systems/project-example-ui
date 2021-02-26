import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/impl"

import { checkPasswordCharacter } from "../../checkCharacter/impl"

import { ValidateBoardInfra } from "../../../../../../../z_vendor/getto-application/board/kernel/infra"

import { InputPasswordAction } from "./action"

import { convertPassword } from "../../../../password/data"

export function initInputPasswordAction(infra: ValidateBoardInfra): InputPasswordAction {
    const resource = initInputBoardValueResource("password")

    const validate = initValidateBoardFieldAction(
        {
            name: "password",
            getter: () => resource.input.get(),
            converter: convertPassword,
        },
        infra,
    )

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
