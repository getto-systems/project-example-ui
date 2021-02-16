import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../../../../../sign/x_Action/Password/Authenticate/Core/main/worker/message"

export type AuthSignPasswordAuthenticateProxyMessage = Readonly<{
    type: "authenticate"
    message: AuthenticatePasswordProxyMessage
}>
export type AuthSignPasswordAuthenticateProxyResponse = Readonly<{
    type: "authenticate"
    response: AuthenticatePasswordProxyResponse
}>
