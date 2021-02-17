import { MockPropsPasser } from "../../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockRegisterPasswordFormAction,
    RegisterPasswordFormMockProps,
} from "../../../../../sign/x_Action/Password/ResetSession/Register/Form/mock"
import {
    initMockRegisterPasswordAction,
    RegisterPasswordMockProps,
} from "../../../../../sign/x_Action/Password/ResetSession/Register/Core/mock"

import { RegisterPasswordResource } from "./resource"

export type RegisterPasswordResourceMockPropsPasser = MockPropsPasser<
    RegisterPasswordResourceMockProps
>
export type RegisterPasswordResourceMockProps = RegisterPasswordMockProps &
    RegisterPasswordFormMockProps

export function initMockRegisterPasswordResourceRegister(
    passer: RegisterPasswordResourceMockPropsPasser
): RegisterPasswordResource {
    return {
        register: initMockRegisterPasswordAction(passer),
        form: initMockRegisterPasswordFormAction(passer),
    }
}
