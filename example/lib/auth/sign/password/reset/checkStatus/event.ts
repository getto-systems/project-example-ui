import {
    CheckPasswordResetSendingStatusError,
    PasswordResetSendingStatus,
    SendPasswordResetTokenError,
} from "./data"

export type CheckPasswordResetSendingStatusEvent =
    | Readonly<{ type: "try-to-check-status" }>
    | Readonly<{ type: "retry-to-check-status"; status: PasswordResetSendingStatus }>
    | Readonly<{ type: "failed-to-check-status"; err: CheckPasswordResetSendingStatusError }>
    | Readonly<{ type: "failed-to-send-token"; err: SendPasswordResetTokenError }>
    | Readonly<{ type: "succeed-to-send-token" }>
