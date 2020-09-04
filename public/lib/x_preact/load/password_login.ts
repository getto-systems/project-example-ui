import { VNode } from "preact";
import { useState, /* useEffect */ } from "preact/hooks";

import { view } from "./password_login/view";

import { PasswordLoginPreactComponent } from "./password_login/component";
import { PasswordLoginState, PasswordLoginComponent } from "../../load/password_login";

import { LoginID } from "../../load/credential/data";
import { Password } from "../../load/password/data";

interface PreactComponent {
    (): VNode;
}

export function PasswordLogin(baseComponent: PasswordLoginComponent, initialState: PasswordLoginState): PreactComponent {
    const component = new PasswordLoginPreactComponentImpl(baseComponent);

    return () => {
        const state = component.useState(...useState(initialState));

        return view(component, state);
    }
}

class PasswordLoginPreactComponentImpl implements PasswordLoginPreactComponent {
    component: PasswordLoginComponent
    setState: PasswordLoginSetState

    constructor(component: PasswordLoginComponent) {
        this.component = component;
        this.setState = (_state: PasswordLoginState) => {
            // useState() で再設定されるのでここには到達しない
            throw new Error("NEVER");
        }
    }

    useState(state: PasswordLoginState, setState: PasswordLoginSetState): PasswordLoginState {
        this.setState = setState;

        const next = this.component.nextState(state);
        if (next.hasNext) {
            next.promise.then(this.setState);
        }

        return state;
    }

    inputLoginID(loginID: LoginID) { this.setState(this.component.inputLoginID(loginID)); }
    changeLoginID(loginID: LoginID) { this.setState(this.component.changeLoginID(loginID)); }

    inputPassword(password: Password) { this.setState(this.component.inputPassword(password)); }
    changePassword(password: Password) { this.setState(this.component.changePassword(password)); }

    showPassword() { this.setState(this.component.showPassword()); }
    hidePassword() { this.setState(this.component.hidePassword()); }

    login() { this.setState(this.component.login()); }
}

interface PasswordLoginSetState {
    (state: PasswordLoginState): void
}
