import {
    PasswordResetSessionClient,
    SessionResponse, createSessionSuccess, createSessionFailed,
    SendTokenResponse,
    GetStatusResponse, getStatusSend, getStatusPolling, getStatusFailed,
} from "../../../infra"

import { initSessionID } from "../../../adapter"

import { SessionID, PollingStatusError } from "../../../data"
import { LoginID } from "../../../../login_id/data"

export function initSimulatePasswordResetSessionClient(targetLoginID: LoginID): PasswordResetSessionClient {
    return new SimulatePasswordResetSessionClient(targetLoginID)
}

type TokenState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "waiting" }> |
    Readonly<{ state: "sending" }> |
    Readonly<{ state: "success" }> |
    Readonly<{ state: "failed", err: PollingStatusError }>

class SimulatePasswordResetSessionClient implements PasswordResetSessionClient {
    tokenState: TokenState = { state: "initial" }

    targetSessionID = initSessionID("session-id")

    targetLoginID: LoginID

    constructor(targetLoginID: LoginID) {
        this.targetLoginID = targetLoginID
    }

    createSession(loginID: LoginID): Promise<SessionResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID === this.targetLoginID) {
                    resolve(createSessionSuccess(this.targetSessionID))
                } else {
                    resolve(createSessionFailed({ type: "invalid-password-reset" }))
                }
            }, 5 * 1000)
        })
    }

    toWaiting(): void {
        this.tokenState = { state: "waiting" }
    }
    toSending(): void {
        this.tokenState = { state: "sending" }
    }
    toSuccess(): void {
        this.tokenState = { state: "success" }
    }

    sendToken(): Promise<SendTokenResponse> {
        setTimeout(this.toWaiting, 1 * 1000)
        setTimeout(this.toSending, 2 * 1000)
        setTimeout(this.toSuccess, 3 * 1000)

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true })
            }, 5 * 1000)
        })
    }

    getStatus(sessionID: SessionID): Promise<GetStatusResponse> {
        return new Promise((resolve) => {
            ((simulate) => {
                setTimeout(() => {
                    resolve(simulate(sessionID))
                }, 5 * 1000)
            })(this.getStatusSimulate)
        })
    }
    getStatusSimulate(sessionID: SessionID): GetStatusResponse {
        if (sessionID !== this.targetSessionID) {
            return getStatusFailed({ type: "invalid-password-reset" })
        }

        switch (this.tokenState.state) {
            case "initial":
                return getStatusFailed({ type: "infra-error", err: "not initialized" })

            case "waiting":
                return getStatusPolling({ type: "log" }, { sending: false })

            case "sending":
                return getStatusPolling({ type: "log" }, { sending: true })

            case "success":
                return getStatusSend({ type: "log" })

            case "failed":
                return getStatusFailed(this.tokenState.err)
        }
    }
}
