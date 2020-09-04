import { initAuthClient } from "../z_external/auth_client/auth_client";

import { LoadAction } from "../load/action";

import { LoadInit, initLoad } from "../load";

import { initStorageCredential } from "../wand/credential/repository/credential/storage";
import { initFetchRenewClient } from "../wand/credential/client/renew/fetch";
import { initFetchPasswordLoginClient } from "../wand/password_login/client/password_login/fetch";
import { initSimulatePasswordResetClient } from "../wand/password_reset/client/password_reset/simulate";
import { initBrowserLocation } from "../wand/script/location/browser";
import { env } from "../y_static/env";

import { CredentialRepository, RenewClient } from "../wand/credential/infra";
import { PasswordLoginClient } from "../wand/password_login/infra";
import { PasswordResetClient } from "../wand/password_reset/infra";
import { ScriptEnv, PathnameLocation } from "../wand/script/infra";

import { credentialAction } from "../wand/credential/core";
import { passwordAction } from "../wand/password/core";
import { passwordLoginAction } from "../wand/password_login/core";
import { passwordResetAction } from "../wand/password_reset/core";
import { scriptAction } from "../wand/script/core";

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
