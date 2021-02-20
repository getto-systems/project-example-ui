import { MockPropsPasser } from "../../../../../../z_getto/application/mock"

import {
    initMockStartPasswordResetSessionAction,
    StartPasswordResetSessionMockProps,
} from "../../../../../sign/x_Action/Password/ResetSession/Start/Core/mock"
import {
    initMockStartPasswordResetSessionFormAction,
    StartPasswordResetSessionFormMockProps,
} from "../../../../../sign/x_Action/Password/ResetSession/Start/Form/mock"

import { StartPasswordResetSessionResource } from "./resource"

export type StartPasswordResetSessionResourceMockPropsPasser = MockPropsPasser<
    StartPasswordResetSessionResourceMockProps
>
export type StartPasswordResetSessionResourceMockProps = StartPasswordResetSessionMockProps &
    StartPasswordResetSessionFormMockProps

export function initMockStartPasswordResetSessionResource(
    passer: StartPasswordResetSessionResourceMockPropsPasser
): StartPasswordResetSessionResource {
    return {
        start: initMockStartPasswordResetSessionAction(passer),
        form: initMockStartPasswordResetSessionFormAction(passer),
    }
}
