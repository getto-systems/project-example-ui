import {
    StartPasswordResetSessionProxyMessage,
    StartPasswordResetSessionProxyResponse,
} from "../../Core/main/worker/message"

export type StartPasswordResetSessionResourceProxyMessage = Readonly<{
    type: "start"
    message: StartPasswordResetSessionProxyMessage
}>
export type StartPasswordResetSessionResourceProxyResponse = Readonly<{
    type: "start"
    response: StartPasswordResetSessionProxyResponse
}>
