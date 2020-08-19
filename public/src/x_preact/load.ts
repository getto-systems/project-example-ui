import { render, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { LoadUsecase, initLoad, LoadView } from "../load";

import { authAction } from "../load/auth/core";
import { initMemoryCredential } from "../load/auth/repository/credential/memory";
import { initSimulateIDClient } from "../load/auth/client/id/simulate";
import { nonceNotFound } from "../load/auth/data";

import { scriptAction } from "../load/script/core";
import { initBrowserLocation } from "../load/script/location/browser";
import { env } from "../y_global/env";

import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";

(async () => {
    render(h(main(await initUsecase()), {}), document.body);
})();

function initUsecase() {
    return initLoad({
        auth: authAction({
            credentials: initMemoryCredential(nonceNotFound),
            idClient: initSimulateIDClient(),
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

            default:
                return assertNever(view)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
