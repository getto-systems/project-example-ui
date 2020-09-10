import {
    PasswordResetClient,
    CreateSessionResponse, createSessionSuccess, createSessionFailed,
    SendTokenResponse, SendTokenError, sendTokenSuccess, //sendTokenFailed,
    GetStatusResponse, getStatusDone, getStatusPolling, getStatusFailed,
    ResetResponse, resetSuccess, resetFailed,
} from "../../infra";

import { LoginID, AuthCredential } from "../../../auth_credential/data";
import { Password } from "../../../password/data";
import { Session } from "../../../password_reset_session/data";
import { ResetToken } from "../../data";

export function initSimulatePasswordResetClient(targetLoginID: LoginID, returnAuthCredential: AuthCredential): PasswordResetClient {
    return new SimulatePasswordResetClient(targetLoginID, returnAuthCredential);
}

type TokenState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "waiting", since: string }> |
    Readonly<{ state: "sending", since: string }> |
    Readonly<{ state: "success", at: string }> |
    Readonly<{ state: "failed", err: SendTokenError }>

class SimulatePasswordResetClient implements PasswordResetClient {
    tokenState: TokenState = { state: "initial" }

    targetSession = { sessionID: "session" }

    targetLoginID: LoginID

    returnAuthCredential: AuthCredential

    constructor(targetLoginID: LoginID, returnAuthCredential: AuthCredential) {
        this.targetLoginID = targetLoginID;

        this.returnAuthCredential = returnAuthCredential;
    }

    createSession(loginID: LoginID): Promise<CreateSessionResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID.loginID === this.targetLoginID.loginID) {
                    resolve(createSessionSuccess(this.targetSession));
                } else {
                    resolve(createSessionFailed({ type: "invalid-password-reset" }));
                }
            }, 5 * 1000);
        });
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
        setTimeout(this.toWaiting, 1 * 1000);
        setTimeout(this.toSending, 2 * 1000);
        setTimeout(this.toSuccess, 3 * 1000);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(sendTokenSuccess);
            }, 5 * 1000);
        });
    }

    getStatus(session: Session): Promise<GetStatusResponse> {
        return new Promise((resolve) => {
            ((simulate) => {
                setTimeout(() => {
                    resolve(simulate(session));
                }, 5 * 1000);
            })(this.getStatusSimulate);
        });
    }
    getStatusSimulate(session: Session): GetStatusResponse {
        if (session.sessionID !== this.targetSession.sessionID) {
            return getStatusFailed({ type: "invalid-password-reset" });
        }

        switch (this.tokenState.state) {
            case "initial":
                return getStatusFailed({ type: "infra-error", err: "not initialized" });

            case "waiting":
            case "sending":
                return getStatusPolling({ type: "log" }, { sending: false, since: this.tokenState.since });

            case "success":
                return getStatusDone({ type: "log" }, { success: true, at: this.tokenState.at });

            case "failed":
                return getStatusFailed(this.tokenState.err);
        }
    }

    reset(token: ResetToken, loginID: LoginID, password: Password): Promise<ResetResponse> {
        return new Promise((resolve) => {
            ((simulate) => {
                setTimeout(() => {
                    resolve(simulate(token, loginID, password));
                }, 5 * 1000);
            })(this.resetSimulate);
        });
    }
    resetSimulate(token: ResetToken, loginID: LoginID, _password: Password): ResetResponse {
        if (loginID.loginID !== this.targetLoginID.loginID) {
            return resetFailed({ type: "invalid-password-reset" });
        } else {
            return resetSuccess(this.returnAuthCredential);
        }
    }
}
