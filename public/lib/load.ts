import { LoadAction } from "./load/action";

import { Transitioner } from "./load/transition";
import { LoadScriptInit, initLoadScript } from "./load/load_script";
import { PasswordLoginInit, initPasswordLogin } from "./load/password_login";
import { PasswordResetInit, initPasswordReset } from "./load/password_reset";

import { TransitionSetter } from "./ability/transition/data";
import { RenewError } from "./ability/credential/data";

export type LoadInit = [LoadUsecase, LoadState]

export interface LoadUsecase {
    initialLoadState(url: URL): Promise<LoadState>
    registerTransitionSetter(setter: TransitionSetter<LoadState>): void
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

export function initLoad(action: LoadAction): LoadUsecase {
    return new LoadUsecaseImpl(action);
}

interface LoadTransition {
    logined(): void
}

class LoadUsecaseImpl implements LoadUsecase {
    action: LoadAction

    transitioner: Transitioner<LoadState>
    transition: LoadTransition

    constructor(action: LoadAction) {
        this.action = action;

        this.transitioner = new Transitioner();

        const transitionTo = this.transitioner.transitionTo;
        const loadScriptView = this.loadScriptView;

        this.transition = {
            logined() {
                // 画面の遷移は state を返してから行う
                setTimeout(() => {
                    transitionTo(loadScriptView());
                }, 0);
            },
        }
    }

    async initialLoadState(url: Readonly<URL>): Promise<LoadState> {
        // TODO たぶんこのあたりで setInterval で renew し続けるようにする

        const renew = await this.action.credential.renew();
        if (renew.success) {
            return this.loadScriptView();
        }

        switch (renew.err.type) {
            case "empty-nonce":
            case "invalid-ticket":
                // ログイン前画面ではアンダースコアで始まる query string を使用する
                if (url.searchParams.get("_password_reset")) {
                    return this.passwordResetView(url);
                } else {
                    return this.passwordLoginView();
                }

            case "bad-request":
            case "server-error":
            case "bad-response":
            case "infra-error":
                return error(renew.err);
        }
    }

    loadScriptView(): LoadState {
        return loadScript(initLoadScript(this.action));
    }
    passwordLoginView(): LoadState {
        return passwordLogin(initPasswordLogin(this.action, this.transition));
    }
    passwordResetView(url: Readonly<URL>): LoadState {
        return passwordReset(initPasswordReset(this.action, url, this.transition));
    }

    registerTransitionSetter(setter: TransitionSetter<LoadState>): void {
        this.transitioner.register(setter);
    }
}
