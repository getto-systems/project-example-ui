import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../password/action_authenticate/init/worker/message"
import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "../../../password/reset/action_check_status/init/worker/message"
import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "../../../password/reset/action_request_token/init/worker/message"
import {
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "../../../password/reset/action_reset/init/worker/message"

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
