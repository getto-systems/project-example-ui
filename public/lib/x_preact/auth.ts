import { render, h, VNode } from "preact";
import { useState } from "preact/hooks";
import { html } from "htm/preact";

import { init } from "../z_main/auth";
import { AuthUsecase } from "../auth";

import { Renew } from "./auth/renew";
import { LoadApplication } from "./auth/load_application";

import { PasswordLogin } from "./auth/password_login";

render(h(main(init(location, localStorage)), {}), document.body);

function main(auth: AuthUsecase) {
    return (): VNode => {
        const [state, setState] = useState(auth.initialState());
        auth.onStateChange(setState);

        switch (state.type) {
            case "renew":
                return h(Renew(auth.initRenew()), {});

            case "load-application":
                return h(LoadApplication(auth.initLoadApplication()), {});

            case "password-login":
                return h(PasswordLogin(auth.initPasswordLogin()), {});

            /*
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
