import { render, h, VNode } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

import { initAuthClient } from "../z_external/auth_client/auth_client";

import { LoadAction } from "../load/action";
import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";

import { LoadInit, LoadState, LoadUsecase, initLoad } from "../load";

import { initStorageCredential } from "../action/credential/repository/credential/storage";
import { initFetchRenewClient } from "../action/credential/client/renew/fetch";
import { initFetchPasswordLoginClient } from "../action/password_login/client/password_login/fetch";
import { initSimulatePasswordResetClient } from "../action/password_reset/client/password_reset/simulate";
import { initBrowserLocation } from "../action/script/location/browser";
import { env } from "../y_static/env";

import { CredentialRepository, RenewClient } from "../action/credential/infra";
import { PasswordLoginClient } from "../action/password_login/infra";
import { PasswordResetClient } from "../action/password_reset/infra";
import { ScriptEnv, PathnameLocation } from "../action/script/infra";

import { credentialAction } from "../action/credential/core";
import { passwordAction } from "../action/password/core";
import { passwordLoginAction } from "../action/password_login/core";
import { passwordResetAction } from "../action/password_reset/core";
import { scriptAction } from "../action/script/core";

(async () => {
    render(h(main(...await initUsecase()), {}), document.body);
})();

function initUsecase(): Promise<LoadInit> {
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

function main(usecase: LoadUsecase, initialState: LoadState) {
    return (): VNode => {
        const [state, setState] = useState(initialState);
        useEffect(() => {
            // TODO たぶんこのあたりで setInterval で renew し続けるようにする
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
        }
    }
}
