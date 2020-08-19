import { render, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { LoadUsecase, initLoad, LoadView } from "../load";

import { credentialAction } from "../load/credential/core";
import { initMemoryCredential } from "../load/credential/repository/credential/memory";

import { renewAction } from "../load/renew/core";
import { initSimulateRenewClient } from "../load/renew/client/renew/simulate";
import { nonceNotFound } from "../load/credential/data";

import { scriptAction } from "../load/script/core";
import { initBrowserLocation } from "../load/script/location/browser";
import { env } from "../y_global/env";

import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";
import { html } from "htm/preact";

(async () => {
    render(h(main(await initUsecase()), {}), document.body);
})();

function initUsecase() {
    return initLoad({
        credential: credentialAction({
            credentials: initMemoryCredential(nonceNotFound),
        }),
        renew: renewAction({
            renewClient: initSimulateRenewClient("NONCE", ["admin", "development"]),
        }),
        script: scriptAction({
            env: {
                secureServer: env.server.secure,
            },
            location: initBrowserLocation(location),
        }),
    });
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
                return html`なんかえらった: ${view.err}`

            default:
                return assertNever(view)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
