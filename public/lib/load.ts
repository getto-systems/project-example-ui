import { LoadAction } from "./load/action";
import { LoadScriptInit, initLoadScript } from "./load/load_script";
import { PasswordLoginInit, initPasswordLogin } from "./load/password_login";
import { PasswordResetInit, initPasswordReset } from "./load/password_reset";

import {
    TransitionState, initialTransition, transitionStacked, transitionRegistered,
    TransitionSetter,
} from "./action/transition/data";
import { RenewError } from "./action/credential/data";

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
    const manager = new TransitionManager();

    const transition = {
        logined() {
            manager.transitionTo(loadScriptView());
        },
    }

    const usecase = {
        registerTransitionSetter: manager.register,
    }

    return [usecase, await initial()]

    async function initial(): Promise<LoadState> {
        const renew = await action.credential.renew();
        if (renew.success) {
            return loadScriptView();
        } else {
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

class TransitionManager {
    state: TransitionState<LoadState>

    constructor() {
        this.state = initialTransition();
    }

    transitionTo(view: LoadState): void {
        switch (this.state.state) {
            case "initial":
            case "stacked":
                this.state = transitionStacked(view);
                return;

            case "registered":
                this.state.setter(view);
                return;

            default:
                return assertNever(this.state);
        }
    }

    register(setter: TransitionSetter<LoadState>): void {
        if (this.state.state === "stacked") {
            ((view) => {
                setTimeout(() => {
                    setter(view);
                }, 0);
            })(this.state.view);
        }

        this.state = transitionRegistered(setter);
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
