import { render, h } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

import { initAuthClient } from "../z_external/auth_client/auth_client";

import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";

import { LoadInit, LoadState, LoadUsecase, initLoad } from "../load";

import { initStorageCredential } from "../load/credential/repository/credential/storage";
import { initFetchRenewClient } from "../load/credential/client/renew/fetch";
import { initFetchPasswordLoginClient } from "../load/password_login/client/password_login/fetch";
import { initSimulatePasswordResetClient } from "../load/password_reset/client/password_reset/simulate";
import { initBrowserLocation } from "../load/script/location/browser";
import { env } from "../y_static/env";

import { CredentialRepository, RenewClient } from "../load/credential/infra";
import { PasswordLoginClient } from "../load/password_login/infra";
import { PasswordResetClient } from "../load/password_reset/infra";
import { ScriptEnv, PathnameLocation } from "../load/script/infra";

import { credentialAction } from "../load/credential/core";
import { passwordAction } from "../load/password/core";
import { passwordLoginAction } from "../load/password_login/core";
import { passwordResetAction } from "../load/password_reset/core";
import { scriptAction } from "../load/script/core";

(async () => {
    render(h(main(...await initUsecase()), {}), document.body);
})();

function initUsecase(): Promise<LoadInit> {
    const authClient = initAuthClient(env.authServerURL);
    const url = new URL(location.toString());

    return initLoad(url, {
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
    });

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

function main(initialState: LoadState, usecase: LoadUsecase) {
    return () => {
        const [state, setState] = useState(initialState);
        useEffect(() => {
            usecase.registerTransitionSetter(setState)
        }, []);

        switch (state.view) {
            case "load-script":
                return h(LoadScript(...state.init), {});

            case "password-login":
                return h(PasswordLogin(...state.init), {});

            case "password-reset":
                //return h(PasswordLogin(state.component), {});
                return html`ここでパスワードリセット！`

            case "error":
                // TODO エラー画面を用意
                return html`なんかえらった！: ${state.err}`

            default:
                return assertNever(state)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
