import {
    RegisterPasswordResetSessionProxyMessage,
    RegisterPasswordResetSessionProxyResponse,
} from "../../../../../../../../sign/x_Action/Password/Reset/Register/Core/main/worker/message"

export type AuthSignPasswordResetSessionRegisterProxyMessage = Readonly<{
    type: "register"
    message: RegisterPasswordResetSessionProxyMessage
}>
export type AuthSignPasswordResetSessionRegisterProxyResponse = Readonly<{
    type: "register"
    response: RegisterPasswordResetSessionProxyResponse
}>
