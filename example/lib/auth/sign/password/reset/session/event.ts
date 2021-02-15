import {
    CheckPasswordResetSessionStatusError,
    PasswordResetDestination,
    PasswordResetSendingStatus,
    SendPasswordResetSessionTokenError,
    PasswordResetSessionID,
    StartPasswordResetSessionError,
} from "./data"

export type StartPasswordResetSessionEvent =
    | Readonly<{ type: "try-to-start-session" }>
    | Readonly<{ type: "delayed-to-start-session" }>
    | Readonly<{ type: "failed-to-start-session"; err: StartPasswordResetSessionError }>
    | Readonly<{ type: "succeed-to-start-session"; sessionID: PasswordResetSessionID }>

export type CheckPasswordResetSessionStatusEvent =
    | Readonly<{ type: "try-to-check-status" }>
    | Readonly<{
          type: "retry-to-check-status"
          dest: PasswordResetDestination
          status: PasswordResetSendingStatus
      }>
    | Readonly<{ type: "failed-to-check-status"; err: CheckPasswordResetSessionStatusError }>
    | Readonly<{
          type: "failed-to-send-token"
          dest: PasswordResetDestination
          err: SendPasswordResetSessionTokenError
      }>
    | Readonly<{ type: "succeed-to-send-token"; dest: PasswordResetDestination }>
