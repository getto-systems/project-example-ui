import { render, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { LoadUsecase, initLoad, LoadViews } from "../load";
import { nonce } from "../load/auth/data";
import { authAction } from "../load/auth/core";
import { initMemoryCredential } from "../load/auth/repository/credential/memory";
import { initSimulateIDClient } from "../load/auth/client/id/simulate";
import { scriptAction } from "../load/script/core";
import { env } from "../env";
import { initBrowserLocation } from "../load/script/location/browser";

import { LoadScript } from "./load/load_script";
import { html } from "htm/preact";

(async () => {
    render(h(main(await initLoad({
        auth: authAction({
            credentials: initMemoryCredential(nonce("NONCE")),
            idClient: initSimulateIDClient(),
        }),
        script: scriptAction({
            env: {
                secureServer: env.server.secure,
            },
            location: initBrowserLocation(location),
        }),
    })), {}), document.body);
})();

function main(load: LoadUsecase) {
    return () => {
        const [view, setView] = useState(load.initial);
        useEffect(() => {
            load.registerTransitionSetter(setView)
        }, []);

        switch (view) {
            case LoadViews.LoadScript:
                return h(LoadScript(load.initLoadScriptComponent()), {});

            default:
                //assertNever(view)
                return html`なんかしらんけど: ${view}`
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
