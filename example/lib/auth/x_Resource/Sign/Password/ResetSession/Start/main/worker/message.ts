import {
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyResponse,
} from "../../../../../../../sign/x_Action/Password/ResetSession/Start/Core/main/worker/message"

export type StartPasswordResetSessionResourceProxyMessage = Readonly<{
    type: "start"
    message: StartPasswordResetSessionProxyMessage
}>
export type StartPasswordResetSessionResourceProxyResponse = Readonly<{
    type: "start"
    response: StartPasswordResetSessionProxyResponse
}>
