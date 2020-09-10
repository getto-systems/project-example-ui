import { VNode } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { PasswordLoginComponent } from "../../auth/password_login";
import { LoginIDComponent, LoginIDState } from "../../auth/password_login/login_id";
import { PasswordComponent, PasswordState } from "../../auth/password_login/password";

import { Password, PasswordView } from "../../ability/password/data";
import { InputContent, LoginError } from "../../ability/password_login/data";
import { InitialValue, hasValue, noValue } from "../../ability/input/data";

interface PreactComponent {
    (): VNode;
}
interface PreactPropsComponent<T> {
    (props: T): VNode;
}

export function PasswordLogin(component: PasswordLoginComponent): PreactComponent {
    return () => {
        const [state, setState] = useState(component.initialState());
        component.onStateChange(setState);

        switch (state.type) {
            case "initial-login":
                return loginForm(initialLoginForm(component));

            case "failed-to-login":
                return loginForm(failedToLoginForm(component, state.content, state.err));

            case "try-to-login":
                return loginForm(tryToLoginForm());

            case "delayed-to-login":
                return loginForm(delayedToLoginForm());

            case "try-to-store":
                // TODO これはなくなるはず
                return html``

            case "failed-to-store":
                // TODO エラー画面を用意
                return html`ログインできませんでした: ${state.err}`
        }
    }
}

function loginForm(content: VNode): VNode {
    return html`
        <aside class="login">
            <section class="login__box">
                ${loginHeader()}
                ${content}
            </section>
        </aside>
    `
}

function initialLoginForm(component: PasswordLoginComponent): VNode {
    const [loginID, password] = component.fields();

    return html`
        <form onSubmit="${onSubmit}">
            <big>
                <section class="login__body">
                    <${LoginIDForm(loginID)} initial="${noValue}"/>
                    <${PasswordForm(password)} initial="${noValue}"/>
                </section>
            </big>
            <big>
                <section class="login__footer button__container">
                    ${loginButton()}
                    ${passwordResetLink()}
                </section>
            </big>
        </form>
    `

    function onSubmit(e: Event) {
        e.preventDefault();
        component.login();

        // submitter を blur する
        // SubmitEvent が使えないので直接 getElementById している
        const button = document.getElementById("login-submit");
        if (button) {
            button.blur();
        }
    }

    function loginButton(): VNode {
        return html`
            <div>
                ${button()}
            </div>
        `

        function button(): VNode {
            // id="login-submit" は onSubmit で button.blur() するのに使用している
            // SubmitEvent が使用可能になったら不必要になる
            return html`
                <button id="login-submit" class="button button_save">ログイン</button>
            `
        }
    }
}
function failedToLoginForm(component: PasswordLoginComponent, content: InputContent, err: LoginError): VNode {
    const [loginID, password] = component.fields();

    return html`
        <form onSubmit="${onSubmit}">
            <big>
                <section class="login__body">
                    <${LoginIDForm(loginID)} initial="${hasValue(content.loginID)}"/>
                    <${PasswordForm(password)} initial="${hasValue(content.password)}"/>
                </section>
            </big>
            <big>
                <section class="login__footer button__container">
                    ${loginButton(err)}
                    ${passwordResetLink()}
                </section>
            </big>
        </form>
    `

    function onSubmit(e: Event) {
        e.preventDefault();
        component.login();

        // submitter を blur する
        // SubmitEvent が使えないので直接 getElementById している
        const button = document.getElementById("login-submit");
        if (button) {
            button.blur();
        }
    }

    function loginButton(err: LoginError): VNode {
        return html`
            <div>
                ${button()}
                <div class="vertical vertical_small"></div>
                ${error()}
            </div>
        `

        function button(): VNode {
            // id="login-submit" は onSubmit で button.blur() するのに使用している
            // SubmitEvent が使用可能になったら不必要になる
            return html`
                <button id="login-submit" class="button button_save">ログイン</button>
            `
        }

        function error(): VNode {
            return html`
                <dl class="form form_error">
                    <dd class="form__field">
                        ${loginErrorMessage()}
                    </dd>
                </dl>
            `

            function loginErrorMessage(): VNode {
                switch (err.type) {
                    case "validation-error":
                        return html`<p class="form__message">正しく入力してください</p>`;

                    case "bad-request":
                        return html`<p class="form__message">アプリケーションエラーにより認証に失敗しました</p>`;

                    case "invalid-password-login":
                        return html`<p class="form__message">ログインIDかパスワードが違います</p>`;

                    case "server-error":
                        return html`<p class="form__message">サーバーエラーにより認証に失敗しました</p>`;

                    case "bad-response":
                        return html`<p class="form__message">レスポンスエラーにより認証に失敗しました</p>`;

                    case "infra-error":
                        return html`<p class="form__message">ネットワークエラーにより認証に失敗しました</p>`;
                }
            }
        }
    }
}
function tryToLoginForm(): VNode {
    // TODO 「ログインしています」にスタイルをあてる
    return html`
        <form>
            <big>
                ログインしています
            </big>
            <big>
                <section class="login__footer button__container">
                    <div/>
                    ${passwordResetLink()}
                </section>
            </big>
        </form>
    `
}
function delayedToLoginForm(): VNode {
    // TODO 「ログインしています」にスタイルをあてる
    return html`
        <form>
            <big>
                ログインしています
            </big>
            <big>
                <section class="login__footer button__container">
                    <div>
                        <dl class="form form_warning">
                            <dd class="form__field">
                                <p class="form__message">
                                    認証に時間がかかっています <i class="lnir lnir-spinner lnir-is-spinning"></i><br/>
                                    1分以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                                </p>
                            </dd>
                        </dl>
                    </div>
                    ${passwordResetLink()}
                </section>
            </big>
        </form>
    `
}

// TODO 別ファイルに分けられるはず
type LoginIDProps = {
    initial: InitialValue,
}

function LoginIDForm(component: LoginIDComponent): PreactPropsComponent<LoginIDProps> {
    return (props: LoginIDProps): VNode => {
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

// TODO 別ファイルに分けられるはず
type PasswordProps = {
    initial: InitialValue,
}

function PasswordForm(component: PasswordComponent): PreactPropsComponent<PasswordProps> {
    return (props: PasswordProps): VNode => {
        const [state, setState] = useState(component.initialState());
        component.onStateChange(setState);

        useEffect(() => {
            if (props.initial.hasValue) {
                setInputValue("password", props.initial.value.inputValue);
                component.setPassword(props.initial.value);
            }
        }, []);

        return html`
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header"><label for="password">パスワード</label></dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" id="password" onInput=${onInput}/>
                    ${error(state)}
                    <p class="form__help">${view(state.view)}</p>
                </dd>
            </dl>
        `

        function onInput(e: InputEvent) {
            if (e.target instanceof HTMLInputElement) {
                component.setPassword({ inputValue: e.target.value });
            }
        }

        function error(state: PasswordState): Array<VNode> {
            if (state.result.valid) {
                return []
            }

            return state.result.err.map((err) => {
                switch (err) {
                    case "empty":
                        return html`<p class="form__message">パスワードを入力してください</p>`

                    case "too-long":
                        if (state.character.complex) {
                            return html`<p class="form__message">パスワードが長すぎます(18文字程度)</p>`
                        } else {
                            return html`<p class="form__message">パスワードが長すぎます(72文字以内)</p>`
                        }
                }
            });
        }

        function view(view: PasswordView): VNode {
            if (view.show) {
                return html`
                    <a href="#" onClick=${hide}>
                        <i class="lnir lnir-key-alt"></i> パスワードを隠す ${characterHelp()}
                    </a>
                    <p class="form__help">${extractPassword(view.password)}</p>
                `
            } else {
                return html`
                    <a href="#" onClick=${show}>
                        <i class="lnir lnir-key-alt"></i> パスワードを表示 ${characterHelp()}
                    </a>
                `
            }

            function show(e: MouseEvent) {
                linkClicked(e);
                component.showPassword();
            }
            function hide(e: MouseEvent) {
                linkClicked(e);
                component.hidePassword();
            }
            function linkClicked(e: MouseEvent) {
                e.preventDefault();

                // クリック後 focus 状態になるのでキャンセル
                if (e.target instanceof HTMLElement) {
                    e.target.blur();
                }
            }

            // TODO ・・・あれ？ InputValue にしたんじゃなかったっけ？
            function extractPassword(password: Password): string {
                if (password.password.length === 0) {
                    return "(入力されていません)";
                } else {
                    return password.password;
                }
            }
        }

        function characterHelp(): string {
            if (state.character.complex) {
                return "(マルチバイト文字が含まれています)";
            } else {
                return "";
            }
        }
    }
}

function passwordResetLink(): VNode {
    return html`
            <div class="login__link">
                <a href="#"><i class="lnir lnir-question-circle"></i> パスワードがわからない方</a>
            </div>
        `
}

// TODO password reset でも同じものを使うので共有したい
function loginHeader(): VNode {
    return html`
        <header class="login__header">
            <cite class="login__brand">GETTO</cite>
            <strong class="login__title">Example</strong>
            <cite class="login__subTitle">code templates</cite>
        </header>
    `
}

function setInputValue(id: string, value: string): void {
    const input = document.getElementById(id);
    if (input instanceof HTMLInputElement) {
        input.value = value;
    }
}
