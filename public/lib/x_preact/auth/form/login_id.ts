import { VNode } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { LoginIDFieldComponent, LoginIDState } from "../../../auth/field/login_id";

import { InitialValue } from "../../../input/data";

interface PreactComponent {
    (props: Props): VNode;
}

type Props = {
    initial: InitialValue,
}

export function LoginIDForm(component: LoginIDFieldComponent): PreactComponent {
    return (props: Props): VNode => {
        const [state, setState] = useState(component.initialState());
        component.onStateChange(setState);

        useEffect(() => {
            if (props.initial.hasValue) {
                setInputValue("login-id", props.initial.value.inputValue);
                component.setLoginID(props.initial.value);
            }
        }, []);

        return html`
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header"><label for="login-id">ログインID</label></dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" id="login-id" onInput=${onInput}/>
                    ${error(state)}
                </dd>
            </dl>
        `

        function onInput(e: InputEvent) {
            if (e.target instanceof HTMLInputElement) {
                component.setLoginID({ inputValue: e.target.value });
            }
        }

        function error(state: LoginIDState): Array<VNode> {
            if (state.result.valid) {
                return []
            }

            return state.result.err.map((err) => {
                switch (err) {
                    case "empty":
                        return html`<p class="form__message">ログインIDを入力してください</p>`
                }
            });
        }
    }
}

function setInputValue(id: string, value: string): void {
    const input = document.getElementById(id);
    if (input instanceof HTMLInputElement) {
        input.value = value;
    }
}
