import {
    RegisterPasswordProxyMessage,
    RegisterPasswordProxyResponse,
} from "../../../../../../../sign/x_Action/Password/ResetSession/Register/Core/main/worker/message"

export type RegisterPasswordResourceProxyMessage = Readonly<{
    type: "register"
    message: RegisterPasswordProxyMessage
}>
export type RegisterPasswordResourceProxyResponse = Readonly<{
    type: "register"
    response: RegisterPasswordProxyResponse
}>
