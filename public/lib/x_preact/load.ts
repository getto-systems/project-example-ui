import { render, h, VNode } from "preact";
import { useState } from "preact/hooks";
import { html } from "htm/preact";

import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";

import { initUsecase } from "../z_main/load";
import { LoadState, LoadUsecase } from "../load";

(async () => {
    render(h(main(...await initUsecase(location)), {}), document.body);
})();

function main(load: LoadUsecase, initialState: LoadState) {
    return (): VNode => {
        const [state, setState] = useState(initialState);
        load.registerTransitionSetter(setState)

        switch (state.view) {
            case "load-script":
                return h(LoadScript(...load.initLoadScript()), {});

            case "password-login":
                return h(PasswordLogin(...state.init), {});

            case "password-reset":
                //return h(PasswordReset(...state.init), {});
                return html`ここでパスワードリセット！`

            case "error":
                // TODO エラー画面を用意
                return html`なんかえらった！: ${state.err}`
        }
    }
}
