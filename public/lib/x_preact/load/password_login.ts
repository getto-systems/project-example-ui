import { VNode } from "preact";
import { html } from "htm/preact";
import { useState, /* useEffect */ } from "preact/hooks";
import { LoginIDValidationError } from "../../load/credential/data";
import { Password, PasswordValidationError } from "../../load/password/data";
import { LoginState, LoginBoard, LoginIDBoard, PasswordBoard, PasswordView, LoginError } from "../../load/password_login/data";
import { PasswordLoginState, PasswordLoginComponent } from "../../load/password_login";

interface component {
    (): VNode;
}

export function PasswordLogin(initialState: PasswordLoginState, component: PasswordLoginComponent): component {
    return (): VNode => {
        const [passwordLoginState, setPasswordLoginState] = useState(initialState);

        switch (passwordLoginState.state) {
            case "active":
                return html`
                    <aside class="login">
                        <section class="login__box">
                            ${loginHeader()}
                            ${loginForm(passwordLoginState.login, passwordLoginState.board)}
                        </section>
                    </aside>
                `

            case "try-to-store-credential":
                passwordLoginState.next.then(setPasswordLoginState);
                return html``

            case "failed-to-store-credential":
                // TODO エラー画面を用意
                return html`保存に失敗: ${passwordLoginState.err}`

            case "success":
                return html``

            default:
                return assertNever(passwordLoginState);
        }

        function loginForm(state: LoginState, board: LoginBoard): VNode {
            return html`
                <form onSubmit="${onSubmit}">
                    <big>
                        <section class="login__body">
                            ${loginID(board.loginID)}
                            ${password(board.password)}
                        </section>
                    </big>
                    <big>
                        <section class="login__footer button__container">
                            ${loginButton(state)}
                            ${passwordResetLink()}
                        </section>
                    </big>
                </form>
            `

            function onSubmit(e: Event) {
                e.preventDefault();

                setPasswordLoginState(component.login());

                // submitter を blur する
                // SubmitEvent が使えないので直接 getElementById している
                const button = document.getElementById("login-submit");
                if (button) {
                    button.blur();
                }
            }
        }

        function loginID(board: LoginIDBoard): VNode {
            return html`
                <dl class="form ${board.err.length == 0 ? "" : "form_error"}">
                    <dt class="form__header"><label for="login-id">ログインID</label></dt>
                    <dd class="form__field">
                        <input type="text" class="input_fill" id="login-id" onInput=${onInput} onChange=${onChange}/>
                        ${board.err.map(validationError)}
                    </dd>
                </dl>
            `

            function onInput(e: InputEvent) {
                if (e.target instanceof HTMLInputElement) {
                    setPasswordLoginState(component.inputLoginID({
                        loginID: e.target.value,
                    }));
                }
            }
            function onChange(e: InputEvent) {
                if (e.target instanceof HTMLInputElement) {
                    setPasswordLoginState(component.changeLoginID({
                        loginID: e.target.value,
                    }));
                }
            }

            function validationError(err: LoginIDValidationError): VNode {
                switch (err) {
                    case "empty":
                        return html`<p class="form__message">ログインIDを入力してください</p>`

                    default:
                        return assertNever(err);
                }
            }
        }

        function password(board: PasswordBoard): VNode {
            return html`
                <dl class="form ${board.err.length == 0 ? "" : "form_error"}">
                    <dt class="form__header"><label for="password">パスワード</label></dt>
                    <dd class="form__field">
                        <input type="password" class="input_fill" id="password" onInput=${onInput} onChange=${onChange}/>
                        ${board.err.map(validationError)}
                        <p class="form__help">${viewPassword(board.view)}</p>
                    </dd>
                </dl>
            `

            function onInput(e: InputEvent) {
                if (e.target instanceof HTMLInputElement) {
                    setPasswordLoginState(component.inputPassword({
                        password: e.target.value,
                    }));
                }
            }
            function onChange(e: InputEvent) {
                if (e.target instanceof HTMLInputElement) {
                    setPasswordLoginState(component.changePassword({
                        password: e.target.value,
                    }));
                }
            }

            function validationError(err: PasswordValidationError): VNode {
                switch (err) {
                    case "empty":
                        return html`<p class="form__message">パスワードを入力してください</p>`

                    case "too-long":
                        if (board.character.complex) {
                            return html`<p class="form__message">パスワードが長すぎます(18文字程度)</p>`
                        } else {
                            return html`<p class="form__message">パスワードが長すぎます(72文字以内)</p>`
                        }

                    default:
                        return assertNever(err);
                }
            }

            function viewPassword(view: PasswordView): VNode {
                if (view.show) {
                    return html`
                        <a href="#" onClick=${hide}>
                            <i class="lnir lnir-key-alt"></i> パスワードを隠す ${characterHelp()}
                        </a>
                        <p class="form__help">${password(view.password)}</p>
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
                    setPasswordLoginState(component.showPassword());

                    if (e.target instanceof HTMLElement) {
                        e.target.blur();
                    }
                }
                function hide(e: MouseEvent) {
                    e.preventDefault();
                    setPasswordLoginState(component.hidePassword());

                    if (e.target instanceof HTMLElement) {
                        e.target.blur();
                    }
                }

                function password(password: Password): string {
                    if (password.password.length === 0) {
                        return "(入力されていません)";
                    } else {
                        return password.password;
                    }
                }
            }

            function characterHelp(): string {
                if (board.character.complex) {
                    return "(マルチバイト文字が含まれています)";
                } else {
                    return "";
                }
            }
        }

        function loginButton(state: LoginState): VNode {
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

                    default:
                        return assertNever(state);
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
                                            認証に時間がかかっています <i class="lnir lnir-spinner lnir-is-spinning"></i>
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
                                    <p class="form__message">${loginErrorMessage(state.err)}</p>
                                </dd>
                            </dl>
                        `

                    default:
                        return assertNever(state);
                }
            }
        }

        function passwordResetLink(): VNode {
            return html`
                <div class="login__link">
                    <a href="#"><i class="lnir lnir-question-circle"></i> パスワードを忘れた方</a>
                </div>
            `
        }
    }

    function loginHeader(): VNode {
        return html`
            <header class="login__header">
                <cite class="login__brand">GETTO</cite>
                <strong class="login__title">Example</strong>
                <cite class="login__subTitle">code templates</cite>
            </header>
        `
    }
}

function loginErrorMessage(err: LoginError): string {
    switch (err.type) {
        case "bad-request":
            return "アプリケーションエラーにより認証に失敗しました";

        case "bad-response":
            return "レスポンスエラーにより認証に失敗しました";

        case "invalid-password-login":
            return "ログインIDかパスワードが違います";

        case "server-error":
            return "サーバーエラーにより認証に失敗しました";

        case "infra-error":
            return "ネットワークエラーにより認証に失敗しました";

        default:
            return assertNever(err);
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
