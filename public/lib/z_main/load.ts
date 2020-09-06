import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client";

import { LoadAction } from "../load/action";

import { LoadInit, initLoad } from "../load";

import { initStorageCredentialRepository } from "../ability/credential/repository/credential/storage";
import { initFetchRenewClient } from "../ability/credential/client/renew/fetch";
import { initFetchPasswordLoginClient } from "../ability/password_login/client/password_login/fetch";
import { initSimulatePasswordResetClient } from "../ability/password_reset/client/password_reset/simulate";
import { initBrowserPathnameLocation } from "../ability/script/location/browser";
import { env } from "../y_static/env";

import { CredentialRepository, RenewClient } from "../ability/credential/infra";
import { PasswordLoginClient } from "../ability/password_login/infra";
import { PasswordResetClient } from "../ability/password_reset/infra";
import { ScriptEnv, PathnameLocation } from "../ability/script/infra";

import { initCredentialAction } from "../ability/credential/core";
import { initPasswordAction } from "../ability/password/core";
import { initPasswordLoginAction } from "../ability/password_login/core";
import { initPasswordResetAction } from "../ability/password_reset/core";
import { initScriptAction } from "../ability/script/core";

export async function initUsecase(browserLocation: Location): Promise<LoadInit> {
    const load = initLoad(initLoadAction());
    const url = new URL(browserLocation.toString());
    return [load, await load.initialLoadState(url)];

    function initLoadAction(): LoadAction {
        const authClient = initAuthClient(env.authServerURL);

        return {
            credential: initCredentialAction({
                credentials: initCredentialRepository(),
                renewClient: initRenewClient(authClient),
            }),
            password: initPasswordAction(),
            passwordLogin: initPasswordLoginAction({
                passwordLoginClient: initPasswordLoginClient(authClient),
            }),
            passwordReset: initPasswordResetAction({
                passwordResetClient: initPasswordResetClient(),
            }),
            script: initScriptAction({
                env: initScriptEnv(),
                location: initPathnameLocation(browserLocation),
            }),
        }
    }

    function initCredentialRepository(): CredentialRepository {
        return initStorageCredentialRepository(localStorage, "GETTO-EXAMPLE-CREDENTIAL");
    }

    function initRenewClient(authClient: AuthClient): RenewClient {
        return initFetchRenewClient(authClient);
    }
    function initPasswordLoginClient(authClient: AuthClient): PasswordLoginClient {
        return initFetchPasswordLoginClient(authClient);
    }
    function initPasswordResetClient(): PasswordResetClient {
        return initSimulatePasswordResetClient(
            { loginID: "admin" },
            { nonce: "nonce" },
            { roles: ["admin", "development"] },
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
