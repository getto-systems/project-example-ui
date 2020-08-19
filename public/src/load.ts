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
    let transition = initialLoadTransitionState();

    function logined() {
        transitionTo(LoadScriptView);
    }

    return {
        initial: await initial(),
        registerTransitionSetter,

        initLoadScriptComponent() {
            return initLoadScriptComponent(action);
        },
        initPasswordLoginComponent() {
            return initPasswordLoginComponent(action, logined);
        },
    };

    async function initial(): Promise<LoadView> {
        try {
            const result = await action.credential.renewApiRoles(action.renew);
            if (result.authorized) {
                return LoadScriptView;
            }

            //return await action.login.selected();
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

        if (transition.state === "transition-to") {
            nextState = { state: "hasNext", view: transition.view }
        }

        transition = {
            state: "registered",
            setter: setter,
        }

        if (nextState.state === "hasNext") {
            setter(nextState.view);
        }
    }

    function transitionTo(view: LoadView) {
        switch (transition.state) {
            case "initial":
                transition = {
                    state: "transition-to",
                    view: view,
                };
                return;
            case "transition-to":
                transition = {
                    state: "transition-to",
                    view: view,
                };
                return;
            case "registered":
                transition.setter(view);
                return;

            default:
                return assertNever(transition);
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
