import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/message"
import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "../../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/main/worker/message"
import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "../../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/main/worker/message"
import {
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "../../../../../../auth/sign/password/reset/reset/x_Action/Reset/main/worker/message"

export type ForegroundMessage =
    | Readonly<{
          type: "password-authenticate"
          message: AuthenticatePasswordProxyMessage
      }>
    | Readonly<{
          type: "password-reset-requestToken"
          message: RequestPasswordResetTokenProxyMessage
      }>
    | Readonly<{
          type: "password-reset-checkStatus"
          message: CheckPasswordResetSendingStatusProxyMessage
      }>
    | Readonly<{
          type: "password-reset"
          message: ResetPasswordProxyMessage
      }>

export type BackgroundMessage =
    | Readonly<{
          type: "password-authenticate"
          response: AuthenticatePasswordProxyResponse
      }>
    | Readonly<{
          type: "password-reset-requestToken"
          response: RequestPasswordResetTokenProxyResponse
      }>
    | Readonly<{
          type: "password-reset-checkStatus"
          response: CheckPasswordResetSendingStatusProxyResponse
      }>
    | Readonly<{
          type: "password-reset"
          response: ResetPasswordProxyResponse
      }>
    | Readonly<{ type: "error"; err: string }>
