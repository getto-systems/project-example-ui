/*
import { LoginID, Password, Session, session } from "../../data";
import { PasswordResetClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

interface passwordResetClient {
    createSession(param: { loginID: string }): Promise<{ session: string }>
    sendToken(): Promise<{ message: string }>
    getStatus(param: { session: string }): Promise<{ dest: string, status: string }>
    reset(param: { token: string, loginID: string, password: string }): Promise<{ nonce: string, roles: Array<string> }>
}

export function initFetchPasswordResetClient(authClient: passwordResetClient): PasswordResetClient {
    return {
        async createSession(loginID: LoginID): Promise<Session> {
            try {
                const response = await authClient.createSession({
                    loginID: loginID.loginID,
                });

                return session(response.session);
            } catch (err) {
                switch (err) {
                    case "bad-response":
                    case "bad-request":
                    case "invalid-password-reset":
                        return credentialUnauthorized(err);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
        async sendToken(): Promise<Credential> {
            try {
                const response = await authClient.sendToken();

                return credentialAuthorized(response.nonce, response.roles);
            } catch (err) {
                switch (err) {
                    case "bad-response":
                    case "bad-request":
                    case "invalid-password-reset":
                        return credentialUnauthorized(err);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
        async getStatus(session: Session): Promise<Credential> {
            try {
                const response = await authClient.getStatus({
                    session: session.sessionID,
                });

                return credentialAuthorized(response.nonce, response.roles);
            } catch (err) {
                switch (err) {
                    case "bad-response":
                    case "bad-request":
                    case "invalid-password-reset":
                        return credentialUnauthorized(err);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
        async reset(token: string, loginID: LoginID, password: Password): Promise<Credential> {
            try {
                const response = await authClient.reset({
                    token,
                    loginID: loginID.loginID,
                    password: password.password,
                });

                return credentialAuthorized(response.nonce, response.roles);
            } catch (err) {
                switch (err) {
                    case "bad-response":
                    case "bad-request":
                    case "invalid-password-reset":
                        return credentialUnauthorized(err);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
    }
}
*/
