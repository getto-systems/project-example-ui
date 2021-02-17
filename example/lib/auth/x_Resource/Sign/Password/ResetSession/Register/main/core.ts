import { newRegisterPasswordAction } from "../../../../../../sign/x_Action/Password/ResetSession/Register/Core/main/core"
import { newRegisterPasswordFormAction } from "../../../../../../sign/x_Action/Password/ResetSession/Register/Form/main"

import { RegisterPasswordBackgroundResource, RegisterPasswordResource } from "../resource"

export function newRegisterPasswordResource(
    webStorage: Storage
): RegisterPasswordResource {
    return newRegisterPasswordResource_merge({
        register: newRegisterPasswordAction(webStorage),
    })
}
export function newRegisterPasswordResource_merge(
    background: RegisterPasswordBackgroundResource
): RegisterPasswordResource {
    return {
        ...background,
        form: newRegisterPasswordFormAction(),
    }
}
