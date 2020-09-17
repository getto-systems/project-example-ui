import {
    PasswordResetSessionClient,
    SessionResponse, createSessionSuccess, createSessionFailed,
    SendTokenResponse,
    StatusResponse, getStatusDone, getStatusPolling, getStatusFailed,
} from "../../../infra"

import { LoginID } from "../../../../login_id/data"
import { Session, PollingStatusError } from "../../../data"

export function initSimulatePasswordResetSessionClient(targetLoginID: LoginID): PasswordResetSessionClient {
    return new SimulatePasswordResetSessionClient(targetLoginID)
}

type TokenState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "waiting", since: string }> |
    Readonly<{ state: "sending", since: string }> |
    Readonly<{ state: "success", at: string }> |
    Readonly<{ state: "failed", err: PollingStatusError }>

class SimulatePasswordResetSessionClient implements PasswordResetSessionClient {
    tokenState: TokenState = { state: "initial" }

    targetSession = { sessionID: "session" }

    targetLoginID: LoginID

    constructor(targetLoginID: LoginID) {
        this.targetLoginID = targetLoginID
    }

    createSession(loginID: LoginID): Promise<SessionResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID.loginID === this.targetLoginID.loginID) {
                    resolve(createSessionSuccess(this.targetSession))
                } else {
                    resolve(createSessionFailed({ type: "invalid-password-reset" }))
                }
            }, 5 * 1000)
        })
    }

    toWaiting(): void {
        this.tokenState = { state: "waiting", since: "" }
    }
    toSending(): void {
        this.tokenState = { state: "sending", since: "" }
    }
    toSuccess(): void {
        this.tokenState = { state: "success", at: "" }
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

    getStatus(session: Session): Promise<StatusResponse> {
        return new Promise((resolve) => {
            ((simulate) => {
                setTimeout(() => {
                    resolve(simulate(session))
                }, 5 * 1000)
            })(this.getStatusSimulate)
        })
    }
    getStatusSimulate(session: Session): StatusResponse {
        if (session.sessionID !== this.targetSession.sessionID) {
            return getStatusFailed({ type: "invalid-password-reset" })
        }

        switch (this.tokenState.state) {
            case "initial":
                return getStatusFailed({ type: "infra-error", err: "not initialized" })

            case "waiting":
            case "sending":
                return getStatusPolling({ type: "log" }, { sending: false, since: this.tokenState.since })

            case "success":
                return getStatusDone({ type: "log" }, { success: true, at: this.tokenState.at })

            case "failed":
                return getStatusFailed(this.tokenState.err)
        }
    }
}
