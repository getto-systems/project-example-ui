import { LoadAction } from "./load/action";

import { Transitioner } from "./load/transition";
import { LoadScriptInit, initLoadScript } from "./load/load_script";
import { PasswordLoginInit, initPasswordLogin } from "./load/password_login";
import { PasswordResetInit, initPasswordReset } from "./load/password_reset";

import { TransitionSetter } from "./wand/transition/data";
import { RenewError } from "./wand/credential/data";

export type LoadInit = [LoadUsecase, LoadState]

export interface LoadUsecase {
    registerTransitionSetter(setter: TransitionSetter<LoadState>): void;
}

export type LoadState =
    Readonly<{ view: "load-script", init: LoadScriptInit }> |
    Readonly<{ view: "password-login", init: PasswordLoginInit }> |
    Readonly<{ view: "password-reset", init: PasswordResetInit }> |
    Readonly<{ view: "error", err: RenewError }>;
function loadScript(init: LoadScriptInit): LoadState {
    return { view: "load-script", init }
}
function passwordLogin(init: PasswordLoginInit): LoadState {
    return { view: "password-login", init }
}
function passwordReset(init: PasswordResetInit): LoadState {
    return { view: "password-reset", init }
}
function error(err: RenewError): LoadState {
    return { view: "error", err }
}

export async function initLoad(action: LoadAction, url: Readonly<URL>): Promise<LoadInit> {
    const transitioner = new Transitioner<LoadState>();

    const transition = {
        logined() {
            transitioner.transitionTo(loadScriptView());
        },
    }

    const usecase = {
        registerTransitionSetter: transitioner.register,
    }

    return [usecase, await initial()]

    async function initial(): Promise<LoadState> {
        const renew = await action.credential.renew();
        if (renew.success) {
            return loadScriptView();
        }

        switch (renew.err.type) {
            case "empty-nonce":
            case "invalid-ticket":
                // ログイン前画面ではアンダースコアで始まる query string を使用する
                if (url.searchParams.get("_password_reset")) {
                    return passwordResetView();
                } else {
                    return passwordLoginView();
                }

            case "bad-request":
            case "server-error":
            case "bad-response":
            case "infra-error":
                return error(renew.err);
        }
    }

    function loadScriptView(): LoadState {
        return loadScript(initLoadScript(action));
    }
    function passwordLoginView(): LoadState {
        return passwordLogin(initPasswordLogin(action, transition));
    }
    function passwordResetView(): LoadState {
        return passwordReset(initPasswordReset(action, url, transition));
    }
}
