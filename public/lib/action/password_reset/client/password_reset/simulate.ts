import { LoginID, NonceValue, ApiRoles } from "../../../credential/data";
import { Password } from "../../../password/data";
import {
    Session,
    ResetToken,
} from "../../data";
import {
    PasswordResetClient,
    CreateSessionResponse,
    createSessionSuccess,
    createSessionFailed,
    SendTokenResponse,
    SendTokenError,
    sendTokenSuccess,
    //sendTokenFailed,
    GetStatusResponse,
    getStatusDone,
    getStatusPolling,
    getStatusFailed,
    ResetResponse,
    resetSuccess,
    resetFailed,
} from "../../infra";

export function initSimulatePasswordResetClient(targetLoginID: LoginID, nonce: NonceValue, roles: ApiRoles): PasswordResetClient {
    type TokenState =
        Readonly<{ state: "initial" }> |
        Readonly<{ state: "waiting", since: string }> |
        Readonly<{ state: "sending", since: string }> |
        Readonly<{ state: "success", at: string }> |
        Readonly<{ state: "failed", err: SendTokenError }>

    let tokenState: TokenState = { state: "initial" }

    const targetSession = { sessionID: "session" }

    return {
        createSession,
        sendToken,
        getStatus,
        reset,
    }

    function createSession(loginID: LoginID): Promise<CreateSessionResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID.loginID === targetLoginID.loginID) {
                    resolve(createSessionSuccess(targetSession));
                } else {
                    resolve(createSessionFailed({ type: "invalid-password-reset" }));
                }
            }, 5 * 1000);
        });
    }

    function sendToken(): Promise<SendTokenResponse> {
        setTimeout(() => {
            tokenState = { state: "waiting", since: "" }
        }, 1 * 1000);
        setTimeout(() => {
            tokenState = { state: "sending", since: "" }
        }, 1 * 1000);
        setTimeout(() => {
            tokenState = { state: "success", at: "" }
        }, 1 * 1000);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(sendTokenSuccess);
            }, 5 * 1000);
        });
    }

    function getStatus(session: Session): Promise<GetStatusResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (session.sessionID !== targetSession.sessionID) {
                    reject(getStatusFailed({ type: "invalid-password-reset" }));
                    return;
                }

                switch (tokenState.state) {
                    case "initial":
                        resolve(getStatusFailed({ type: "infra-error", err: "not initialized" }));
                        return;

                    case "waiting":
                    case "sending":
                        resolve(getStatusPolling({ type: "log" }, { sending: false, since: tokenState.since }));
                        return;

                    case "success":
                        resolve(getStatusDone({ type: "log" }, { success: true, at: tokenState.at }));
                        return;

                    case "failed":
                        resolve(getStatusFailed(tokenState.err));
                        return;
                }
            }, 5 * 1000);
        });
    }

    function reset(token: ResetToken, loginID: LoginID, _password: Password): Promise<ResetResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (loginID.loginID !== targetLoginID.loginID) {
                    resolve(resetFailed({ type: "invalid-password-reset" }));
                } else {
                    resolve(resetSuccess(nonce, roles));
                }
            }, 5 * 1000);
        });
    }
}
