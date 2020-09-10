import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client";

import { AuthAction } from "../auth/action";

import { AuthUsecase, initAuthUsecase } from "../auth";

import { initStorageAuthCredentialRepository } from "../auth_credential/infra/repository/credential/storage";
import { initFetchRenewClient } from "../auth_credential/infra/client/renew/fetch";
import { initBrowserPathnameLocation } from "../script/infra/location/browser";
import { initFetchPasswordLoginClient } from "../password_login/infra/client/password_login/fetch";
import { initSimulatePasswordResetSessionClient } from "../password_reset_session/infra/client/password_reset_session/simulate";
import { initSimulatePasswordResetClient } from "../password_reset/infra/client/password_reset/simulate";
import { env } from "../y_static/env";

import { AuthCredentialRepository, RenewClient } from "../auth_credential/infra";
import { ScriptEnv, PathnameLocation } from "../script/infra";
import { PasswordLoginClient } from "../password_login/infra";
import { PasswordResetSessionClient } from "../password_reset_session/infra";
import { PasswordResetClient } from "../password_reset/infra";

import { initAuthCredentialAction } from "../auth_credential/impl";
import { initScriptAction } from "../script/impl";
import { initPasswordAction } from "../password/impl";
import { initPasswordLoginAction } from "../password_login/impl";
import { initPasswordResetSessionAction } from "../password_reset_session/impl";
import { initPasswordResetAction } from "../password_reset/impl";

export function init(browserLocation: Location, storage: Storage): AuthUsecase {
    const url = new URL(browserLocation.toString());
    return initAuthUsecase(url, initAuthAction());

    function initAuthAction(): AuthAction {
        const authClient = initAuthClient(env.authServerURL);

        return {
            authCredential: initAuthCredentialAction({
                authCredentials: initAuthCredentialRepository(),
                renewClient: initRenewClient(authClient),
            }),
            script: initScriptAction({
                env: initScriptEnv(),
                location: initPathnameLocation(browserLocation),
            }),
            password: initPasswordAction(),

            passwordLogin: initPasswordLoginAction({
                passwordLoginClient: initPasswordLoginClient(authClient),
            }),
            passwordResetSession: initPasswordResetSessionAction({
                passwordResetSessionClient: initPasswordResetSessionClient(),
            }),
            passwordReset: initPasswordResetAction({
                passwordResetClient: initPasswordResetClient(),
            }),
        }
    }

    function initAuthCredentialRepository(): AuthCredentialRepository {
        return initStorageAuthCredentialRepository(storage, "GETTO-EXAMPLE-CREDENTIAL");
    }

    function initRenewClient(authClient: AuthClient): RenewClient {
        return initFetchRenewClient(authClient);
    }
    function initPasswordLoginClient(authClient: AuthClient): PasswordLoginClient {
        return initFetchPasswordLoginClient(authClient);
    }
    function initPasswordResetSessionClient(): PasswordResetSessionClient {
        return initSimulatePasswordResetSessionClient({ loginID: "admin" });
    }
    function initPasswordResetClient(): PasswordResetClient {
        return initSimulatePasswordResetClient(
            { loginID: "admin" },
            {
                ticketNonce: { ticketNonce: "ticket-nonce" },
                apiCredential: {
                    apiRoles: { apiRoles: ["admin", "development"] },
                },
            },
        );
    }

    function initScriptEnv(): ScriptEnv {
        return {
            secureServerHost: env.secureServerHost,
        }
    }
    function initPathnameLocation(browserLocation: Location): PathnameLocation {
        return initBrowserPathnameLocation(browserLocation);
    }
}
