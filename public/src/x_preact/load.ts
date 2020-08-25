import { render, h } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";

import { LoadUsecase, initLoad, LoadView } from "../load";

import { initStorageCredential } from "../load/credential/repository/credential/storage";
import { initFetchRenewClient } from "../load/renew/client/renew/fetch";
import { initFetchPasswordLoginClient } from "../load/password_login/client/password_login/fetch";
import { initBrowserLocation } from "../load/script/location/browser";
import { env } from "../y_static/env";

import { CredentialRepository } from "../load/credential/infra";
import { RenewClient } from "../load/renew/infra";
import { PasswordLoginClient } from "../load/password_login/infra";
import { ScriptEnv, PathnameLocation } from "../load/script/infra";

import { credentialAction } from "../load/credential/core";
import { renewAction } from "../load/renew/core";
import { passwordLoginAction } from "../load/password_login/core";
import { scriptAction } from "../load/script/core";

import { initAuthClient } from "../z_external/auth_client";

(async () => {
    render(h(main(await initUsecase()), {}), document.body);
})();

function initUsecase(): Promise<LoadUsecase> {
    const authClient = initAuthClient(env.authServerURL);

    return initLoad({
        credential: credentialAction({
            credentials: initCredentialRepository(),
        }),
        renew: renewAction({
            renewClient: initRenewClient(),
        }),
        passwordLogin: passwordLoginAction({
            passwordLoginClient: initPasswordLoginClient(),
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

    function initScriptEnv(): ScriptEnv {
        return {
            secureServerHost: env.secureServerHost,
        }
    }
    function initPathnameLocation(): PathnameLocation {
        return initBrowserLocation(location);
    }
}

function main(load: LoadUsecase) {
    return () => {
        const [view, setView] = useState<LoadView>(load.initial);
        useEffect(() => {
            load.registerTransitionSetter(setView)
        }, []);

        switch (view.name) {
            case "load-script":
                return h(LoadScript(load.initLoadScriptComponent()), {});

            case "password-login":
                return h(PasswordLogin(load.initPasswordLoginComponent()), {});

            case "error":
                return html`なんかえらった！: ${view.err}`

            default:
                return assertNever(view)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
