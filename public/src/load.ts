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
    Readonly<{ name: "password-login" }>;

const LoadScriptView: LoadView = { name: "load-script" };
const PasswordLoginView: LoadView = { name: "password-login" };

export async function initLoad(action: LoadAction): Promise<LoadUsecase> {
    let transition = initialLoadTransitionState();

    return {
        initial: await initial(),
        registerTransitionSetter,

        initLoadScriptComponent() {
            return initLoadScriptComponent(action);
        },
        initPasswordLoginComponent() {
            return initPasswordLoginComponent(action);
        },
    };

    async function initial(): Promise<LoadView> {
        const auth = await action.auth.renew();
        if (auth.authorized) {
            return LoadScriptView;
        }

        //return await action.login.selected();
        return PasswordLoginView;
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
