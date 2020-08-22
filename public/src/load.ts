import { LoadAction } from "./load/action";
import { LoadScriptComponent, initLoadScriptComponent } from "./load/load_script";
import { PasswordLoginComponent, initPasswordLoginComponent } from "./load/password_login";

export interface LoadUsecase {
    initial: LoadView;
    registerTransitionSetter(setter: LoadTransitionSetter): void;

    initLoadScriptComponent(): LoadScriptComponent;
    initPasswordLoginComponent(): PasswordLoginComponent;
}
export interface LoadTransitionSetter {
    (view: LoadView): void;
}

export type LoadView =
    Readonly<{ name: "load-script" }> |
    Readonly<{ name: "password-login" }> |
    Readonly<{ name: "error", err: string }>;

const LoadScriptView: LoadView = { name: "load-script" };
const PasswordLoginView: LoadView = { name: "password-login" };
function errorView(err: string): LoadView {
    return { name: "error", err: err }
}

export async function initLoad(action: LoadAction): Promise<LoadUsecase> {
    let transitionState = initialLoadTransitionState();

    const transition = {
        logined() {
            transitionTo(LoadScriptView);
        },
        passwordReset() {
            //transitionTo(PasswordResetView);
        },
    }

    return {
        initial: await initial(),
        registerTransitionSetter,

        initLoadScriptComponent() {
            return initLoadScriptComponent(action);
        },
        initPasswordLoginComponent() {
            return initPasswordLoginComponent(action, transition);
        },
    };

    async function initial(): Promise<LoadView> {
        try {
            const result = await action.credential.renewApiRoles(action.renew);
            if (result.authorized) {
                return LoadScriptView;
            }

            if (result.err === "server-error") {
                return errorView(result.err);
            }

            // TODO パスワードリセットを追加したら選択した View を表示する
            return PasswordLoginView;
        } catch (err) {
            return errorView(`${err}`);
        }
    }

    function registerTransitionSetter(setter: LoadTransitionSetter) {
        type state =
            Readonly<{ state: "empty" }> |
            Readonly<{ state: "hasNext", view: LoadView }>;

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

    function transitionTo(view: LoadView) {
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
    Readonly<{ state: "transition-to", view: LoadView }> |
    Readonly<{ state: "registered", setter: LoadTransitionSetter }>;

function initialLoadTransitionState(): LoadTransitionState {
    return { state: "initial" }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
