import { VNode } from "preact";
import { useState, /* useEffect */ } from "preact/hooks";

import { view } from "./password_login/view";

import { PreactBaseComponent, PreactLoginComponent } from "./password_login/component";
import { PasswordLoginState, PasswordLoginComponent, LoginComponent } from "../../load/password_login";

import { LoginID } from "../../ability/auth_credential/data";
import { Password } from "../../ability/password/data";

interface PreactComponent {
    (): VNode;
}

interface PasswordLoginSetState {
    (state: PasswordLoginState): void
}

export function PasswordLogin(baseComponent: PasswordLoginComponent, initialState: PasswordLoginState): PreactComponent {
    const component = new BaseComponent(baseComponent);

    return () => {
        const state = component.useState(...useState(initialState));

        return view(component, state);
    }
}

class BaseComponent implements PreactBaseComponent {
    component: PasswordLoginComponent
    login: PreactLoginComponentImpl

    constructor(component: PasswordLoginComponent) {
        this.component = component;
        this.login = new PreactLoginComponentImpl(component.login);
    }

    useState(state: PasswordLoginState, setState: PasswordLoginSetState): PasswordLoginState {
        this.login.setState = setState;

        const next = this.component.nextState(state);
        if (next.hasNext) {
            next.promise.then(setState);
        }

        return state;
    }
}

class PreactLoginComponentImpl implements PreactLoginComponent {
    component: LoginComponent
    setState: PasswordLoginSetState = invalidSetState

    constructor(component: LoginComponent) {
        this.component = component;
    }

    inputLoginID(loginID: LoginID) { this.setState(this.component.inputLoginID(loginID)); }
    changeLoginID() { this.setState(this.component.changeLoginID()); }

    inputPassword(password: Password) { this.setState(this.component.inputPassword(password)); }
    changePassword() { this.setState(this.component.changePassword()); }

    showPassword() { this.setState(this.component.showPassword()); }
    hidePassword() { this.setState(this.component.hidePassword()); }

    login() { this.setState(this.component.login()); }
}

function invalidSetState(_state: PasswordLoginState) {
    // useState() で再設定されるのでここには到達しない
    throw new Error("NEVER");
}
