import { render, h, VNode } from "preact";
import { useState } from "preact/hooks";
import { html } from "htm/preact";

import { init } from "../z_main/auth";
import { AuthState, AuthUsecase } from "../auth";

import { Renew } from "./auth/renew";

render(h(main(init(location, localStorage)), {}), document.body);

function main(auth: AuthUsecase) {
    return (): VNode => {
        const [state, setState] = useState<AuthState>(auth.initialState());
        auth.onStateChange(setState);

        switch (state.view) {
            case "renew":
                return h(Renew(auth.initRenew()), {});

            case "load-application":
                return html`ここでスクリプトをロード！`
            //return h(LoadApplication(auth.initLoadApplication()), {});

            /*
            case "password-login":
                return h(PasswordLogin(...state.init), {});

            case "password-reset":
                //return h(PasswordReset(...state.init), {});
                return html`ここでパスワードリセット！`
             */

            case "error":
                // TODO エラー画面を用意
                return html`なんかえらった！: ${state.err}`
        }
    }
}