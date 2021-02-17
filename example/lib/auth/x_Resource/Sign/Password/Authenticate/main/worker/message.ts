import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../../../../sign/x_Action/Password/Authenticate/Core/main/worker/message"

export type AuthenticatePasswordResourceProxyMessage = Readonly<{
    type: "authenticate"
    message: AuthenticatePasswordProxyMessage
}>
export type AuthenticatePasswordResourceProxyResponse = Readonly<{
    type: "authenticate"
    response: AuthenticatePasswordProxyResponse
}>
