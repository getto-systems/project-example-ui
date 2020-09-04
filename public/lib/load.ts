import { LoadAction } from "./load/action";
import { LoadScriptInit, initLoadScript } from "./load/load_script";
import { PasswordLoginInit, initPasswordLogin } from "./load/password_login";
import { PasswordResetInit, initPasswordReset } from "./load/password_reset";

import { RenewError } from "./action/credential/data";

export type LoadInit = [LoadState, LoadUsecase]

export interface LoadUsecase {
    registerTransitionSetter(setter: LoadTransitionSetter): void;
}
export interface LoadTransitionSetter {
    (view: LoadState): void;
}

export type LoadState =
    Readonly<{ view: "load-script", init: LoadScriptInit }> |
    Readonly<{ view: "password-login", init: PasswordLoginInit }> |
    Readonly<{ view: "password-reset", init: PasswordResetInit }> |
    Readonly<{ view: "error", err: RenewError }>;
function viewLoadScript(init: LoadScriptInit): LoadState {
    return { view: "load-script", init }
}
function viewPasswordLogin(init: PasswordLoginInit): LoadState {
    return { view: "password-login", init }
}
function viewPasswordReset(init: PasswordResetInit): LoadState {
    return { view: "password-reset", init }
}
function viewError(err: RenewError): LoadState {
    return { view: "error", err }
}

export async function initLoad(url: Readonly<URL>, action: LoadAction): Promise<LoadInit> {
    // TODO load/transition にアクションを定義
    let transitionState = initialLoadTransitionState;

    const transition = {
        logined() {
            transitionTo(loadScriptView());
        },
    }

    const usecase = {
        registerTransitionSetter,
    }

    return [await initial(), usecase]

    function loadScriptView(): LoadState {
        return viewLoadScript(initLoadScript(action));
    }
    function passwordLoginView(): LoadState {
        return viewPasswordLogin(initPasswordLogin(action, transition));
    }
    function passwordResetView(): LoadState {
        return viewPasswordReset(initPasswordReset(action, url, transition));
    }

    async function initial(): Promise<LoadState> {
        const renew = await action.credential.renew();
        if (renew.success) {
            return loadScriptView();
        } else {
            switch (renew.err.type) {
                case "server-error":
                case "bad-response":
                case "infra-error":
                    return viewError(renew.err);
                default:
                    // ログイン前画面ではアンダースコアで始まる query string を使用する
                    if (url.searchParams.get("_password_reset")) {
                        return passwordResetView();
                    } else {
                        return passwordLoginView();
                    }
            }
        }
    }

    function registerTransitionSetter(setter: LoadTransitionSetter) {
        type state =
            Readonly<{ state: "empty" }> |
            Readonly<{ state: "hasNext", view: LoadState }>;

        let nextState: state = { state: "empty" }

        if (transitionState.state === "transition-to") {
            nextState = { state: "hasNext", view: transitionState.view }
        }

        transitionState = {
            state: "registered",
            setter: setter,
        }

        if (nextState.state === "hasNext") {
            setter(nextState.view);
        }
    }

    function transitionTo(view: LoadState) {
        switch (transitionState.state) {
            case "initial":
                transitionState = {
                    state: "transition-to",
                    view: view,
                };
                return;
            case "transition-to":
                transitionState = {
                    state: "transition-to",
                    view: view,
                };
                return;
            case "registered":
                transitionState.setter(view);
                return;

            default:
                return assertNever(transitionState);
        }
    }
}

type LoadTransitionState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "transition-to", view: LoadState }> |
    Readonly<{ state: "registered", setter: LoadTransitionSetter }>;

const initialLoadTransitionState: LoadTransitionState = { state: "initial" }

function assertNever(_: never): never {
    throw new Error("NEVER");
}
