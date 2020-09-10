import { VNode } from "preact";
import { html } from "htm/preact";

import { PreactBaseComponent, PreactLoginComponent } from "./component";
import { PasswordLoginState } from "../../../load/password_login";

import { LoginID, LoginIDBoard, LoginIDValidationError, StoreCredentialState } from "../../../ability/auth_credential/data";
import { Password, PasswordBoard, PasswordView, PasswordValidationError } from "../../../ability/password/data";
import { LoginState, LoginBoard, LoginError } from "../../../ability/password_login/data";

export function view(component: PreactBaseComponent, state: PasswordLoginState): VNode {
    switch (state.type) {
        case "login":
            return viewLogin(component.login, ...state.state);

        case "store-credential":
            return viewStoreCredential(...state.state);
    }
}

function viewLogin(component: PreactLoginComponent, board: LoginBoard, state: LoginState): VNode {
    return html`
        <aside class="login">
            <section class="login__box">
                ${loginHeader()}
                ${loginForm(...board)}
            </section>
        </aside>
    `

    function loginForm(loginID: LoginIDBoard, password: PasswordBoard): VNode {
        return html`
            <form onSubmit="${onSubmit}">
                <big>
                    <section class="login__body">
                        ${loginIDForm(loginID)}
                        ${passwordForm(password)}
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
    }

    function loginIDForm(loginID: LoginIDBoard): VNode {
        return html`
            <dl class="form ${valid(loginID) ? "" : "form_error"}">
                <dt class="form__header"><label for="login-id">ログインID</label></dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" id="login-id" onInput=${onInput} onChange=${onChange}/>
                    ${loginID.err.map(validationError)}
                </dd>
            </dl>
        `

        function onInput(e: InputEvent) {
            component.inputLoginID(getLoginID(e));
        }
        function onChange(e: InputEvent) {
            component.inputLoginID(getLoginID(e));
            component.changeLoginID();
        }
        function getLoginID(e: InputEvent): LoginID {
            if (e.target instanceof HTMLInputElement) {
                return { loginID: e.target.value }
            }
            return { loginID: "" }
        }

        function validationError(err: LoginIDValidationError): VNode {
            switch (err) {
                case "empty":
                    return html`<p class="form__message">ログインIDを入力してください</p>`
            }
        }
    }

    function passwordForm(password: PasswordBoard): VNode {
        return html`
            <dl class="form ${valid(password) ? "" : "form_error"}">
                <dt class="form__header"><label for="password">パスワード</label></dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" id="password" onInput=${onInput} onChange=${onChange}/>
                    ${password.err.map(validationError)}
                    <p class="form__help">${viewPassword(password.view)}</p>
                </dd>
            </dl>
        `

        function onInput(e: InputEvent) {
            component.inputPassword(getPassword(e));
        }
        function onChange(e: InputEvent) {
            component.inputPassword(getPassword(e));
            component.changePassword();
        }
        function getPassword(e: InputEvent): Password {
            if (e.target instanceof HTMLInputElement) {
                return { password: e.target.value }
            }
            return { password: "" }
        }

        function validationError(err: PasswordValidationError): VNode {
            switch (err) {
                case "empty":
                    return html`<p class="form__message">パスワードを入力してください</p>`

                case "too-long":
                    if (password.character.complex) {
                        return html`<p class="form__message">パスワードが長すぎます(18文字程度)</p>`
                    } else {
                        return html`<p class="form__message">パスワードが長すぎます(72文字以内)</p>`
                    }
            }
        }

        function viewPassword(view: PasswordView): VNode {
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
                e.preventDefault();
                component.showPassword();

                if (e.target instanceof HTMLElement) {
                    e.target.blur();
                }
            }
            function hide(e: MouseEvent) {
                e.preventDefault();
                component.hidePassword();

                if (e.target instanceof HTMLElement) {
                    e.target.blur();
                }
            }

            function extractPassword(password: Password): string {
                if (password.password.length === 0) {
                    return "(入力されていません)";
                } else {
                    return password.password;
                }
            }
        }

        function characterHelp(): string {
            if (password.character.complex) {
                return "(マルチバイト文字が含まれています)";
            } else {
                return "";
            }
        }
    }

    function loginButton(): VNode {
        return html`
            <div>
                ${button()}
                <div class="vertical vertical_small"></div>
                ${error()}
            </div>
        `

        function button(): VNode {
            switch (state.state) {
                case "initial-login":
                case "failed-to-login":
                    // id="login-submit" は onSubmit で button.blur() するのに使用している
                    // SubmitEvent が使用可能になったら不必要になる
                    return html`
                        <button id="login-submit" class="button button_save">ログイン</button>
                    `

                case "try-to-login":
                    return html`
                        <button type="button" class="button button_saving">
                            <i class="lnir lnir-spinner lnir-is-spinning"></i> ログイン中
                        </button>
                    `

                case "succeed-to-login":
                    return html``
            }
        }

        function error(): VNode {
            switch (state.state) {
                case "initial-login":
                case "succeed-to-login":
                    return html``

                case "try-to-login":
                    if (state.delayed) {
                        return html`
                            <dl class="form form_warning">
                                <dd class="form__field">
                                    <p class="form__message">
                                        認証に時間がかかっています <i class="lnir lnir-spinner lnir-is-spinning"></i><br/>
                                        1分以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                                    </p>
                                </dd>
                            </dl>
                        `
                    }
                    return html``

                case "failed-to-login":
                    return html`
                        <dl class="form form_error">
                            <dd class="form__field">
                                ${loginErrorMessage(state.err)}
                            </dd>
                        </dl>
                    `
            }

            function loginErrorMessage(err: LoginError): VNode {
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

    function passwordResetLink(): VNode {
        return html`
            <div class="login__link">
                <a href="#"><i class="lnir lnir-question-circle"></i> パスワードがわからない方</a>
            </div>
        `
    }
}

function viewStoreCredential(state: StoreCredentialState): VNode {
    switch (state.state) {
        case "initial-store-credential":
        case "try-to-store-credential":
            // 短時間で遷移するはずなので描画はしない
            return html``

        case "failed-to-store-credential":
            // TODO エラー画面を用意
            return html`保存に失敗: ${state.err}`

        case "succeed-to-store-credential":
            return html``
    }
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

function valid<T>(board: { err: Array<T> }): boolean {
    return board.err.length === 0;
}
