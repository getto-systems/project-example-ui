import { initAuthClient } from "../z_external/auth_client/auth_client";

import { LoadAction } from "../load/action";

import { LoadInit, initLoad } from "../load";

import { initStorageCredential } from "../ability/credential/repository/credential/storage";
import { initFetchRenewClient } from "../ability/credential/client/renew/fetch";
import { initFetchPasswordLoginClient } from "../ability/password_login/client/password_login/fetch";
import { initSimulatePasswordResetClient } from "../ability/password_reset/client/password_reset/simulate";
import { initBrowserLocation } from "../ability/script/location/browser";
import { env } from "../y_static/env";

import { CredentialRepository, RenewClient } from "../ability/credential/infra";
import { PasswordLoginClient } from "../ability/password_login/infra";
import { PasswordResetClient } from "../ability/password_reset/infra";
import { ScriptEnv, PathnameLocation } from "../ability/script/infra";

import { credentialAction } from "../ability/credential/core";
import { passwordAction } from "../ability/password/core";
import { passwordLoginAction } from "../ability/password_login/core";
import { passwordResetAction } from "../ability/password_reset/core";
import { scriptAction } from "../ability/script/core";

export function mainLoad(): Promise<LoadInit> {
    const url = new URL(location.toString());
    const authClient = initAuthClient(env.authServerURL);

    const action: LoadAction = {
        credential: credentialAction({
            credentials: initCredentialRepository(),
            renewClient: initRenewClient(),
        }),
        password: passwordAction(),
        passwordLogin: passwordLoginAction({
            passwordLoginClient: initPasswordLoginClient(),
        }),
        passwordReset: passwordResetAction({
            passwordResetClient: initPasswordResetClient(),
        }),
        script: scriptAction({
            env: initScriptEnv(),
            location: initPathnameLocation(),
        }),
    }

    return initLoad(action, url);

    function initCredentialRepository(): CredentialRepository {
        return initStorageCredential(localStorage, "GETTO-EXAMPLE-CREDENTIAL");
    }

    function initRenewClient(): RenewClient {
        return initFetchRenewClient(authClient);
    }
    function initPasswordLoginClient(): PasswordLoginClient {
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
    function initPathnameLocation(): PathnameLocation {
        return initBrowserLocation(location);
    }
}
