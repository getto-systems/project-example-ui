import { render, h, VNode } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";

import { mainLoad } from "../z_main/load";

import { LoadState, LoadUsecase } from "../load";

(async () => {
    render(h(main(...await mainLoad()), {}), document.body);
})();

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
