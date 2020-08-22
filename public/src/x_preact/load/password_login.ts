import { VNode } from "preact";
import { html } from "htm/preact";
import { useState, /* useEffect */ } from "preact/hooks";
import {
    PasswordLoginComponent,
    PasswordLoginState,
    AuthState,
    AuthDelayed,
    LoginIDState,
    PasswordState,
    LoginIDValidationError,
    PasswordValidationError,
    PasswordLoginError,
} from "../../load/password_login";

interface component {
    (): VNode;
}

export function PasswordLogin(component: PasswordLoginComponent): component {
    return (): VNode => {
        const [passwordLoginState, setPasswordLoginState] = useState<PasswordLoginState>(component.initial);

        if (passwordLoginState.state !== "active") {
            return html``
        }

        return html`
            <aside class="login">
                <section class="login__box">
                    ${loginHeader()}
                    ${loginForm(passwordLoginState.auth, passwordLoginState.loginID, passwordLoginState.password)}
                </section>
            </aside>
        `

        function loginForm(authState: AuthState, loginIDState: LoginIDState, passwordState: PasswordState): VNode {
            return html`
                <form onSubmit="${onSubmit}">
                    <big>
                        <section class="login__body">
                            ${loginID(loginIDState)}
                            ${password(passwordState)}
                        </section>
                    </big>
                    <big>
                        <section class="login__footer button__container">
                            ${loginButton(authState)}
                            ${passwordResetLink()}
                        </section>
                    </big>
                </form>
            `

            function onSubmit(e: Event) {
                e.preventDefault();

                const [newState, promise] = component.login();
                setPasswordLoginState(newState);
                promise.then((delayed: AuthDelayed) => {
                    setPasswordLoginState(delayed.state);
                    delayed.promise.then(setPasswordLoginState);
                });

                const button = document.getElementById("login-submit");
                if (button) {
                    button.blur();
                }
            }
        }

        function loginID(state: LoginIDState): VNode {
            return html`
                <dl class="form ${state.validation.valid ? "" : "form_error"}">
                    <dt class="form__header"><label for="login-id">ログインID</label></dt>
                    <dd class="form__field">
                        <input type="text" class="input_fill" id="login-id" onInput=${onInput} onChange=${onInput}/>
                        ${validationErrorMessage()}
                    </dd>
                </dl>
            `

            function onInput(e: InputEvent) {
                if (e.target instanceof HTMLInputElement) {
                    setPasswordLoginState(component.setLoginID({
                        loginID: e.target.value,
                    }));
                }
            }

            function validationErrorMessage(): VNode {
                if (state.validation.valid) {
                    return html``
                }

                return html`${state.validation.err.map((err: LoginIDValidationError) => {
                    return html`<p class="form__message">${validationError(err)}</p>`
                })}`;
            }
            function validationError(err: LoginIDValidationError): string {
                switch (err) {
                    case "empty":
                        return "ログインIDを入力してください";

                    default:
                        return assertNever(err);
                }
            }
        }

        function password(state: PasswordState): VNode {
            return html`
                <dl class="form ${state.validation.valid ? "" : "form_error"}">
                    <dt class="form__header"><label for="password">パスワード</label></dt>
                    <dd class="form__field">
                        <input type="password" class="input_fill" id="password" onInput=${onInput} onChange=${onInput}/>
                        ${validationErrorMessage()}
                        <p class="form__help">${viewPassword()}</p>
                    </dd>
                </dl>
            `

            function onInput(e: InputEvent) {
                if (e.target instanceof HTMLInputElement) {
                    setPasswordLoginState(component.setPassword({
                        password: e.target.value,
                    }));
                }
            }

            function validationErrorMessage(): VNode {
                if (state.validation.valid) {
                    return html``
                }

                return html`${state.validation.err.map((err: PasswordValidationError) => {
                    return html`<p class="form__message">${validationError(err)}</p>`
                })}`;
            }
            function validationError(err: PasswordValidationError): string {
                switch (err) {
                    case "empty":
                        return "パスワードを入力してください";

                    case "too-long":
                        switch (state.character.type) {
                            case "ascii":
                                return "パスワードが長すぎます(72文字以内)";

                            case "complex":
                                return "パスワードが長すぎます(18文字程度)";

                            default:
                                return assertNever(state.character)
                        }

                    default:
                        return assertNever(err);
                }
            }

            function viewPassword(): VNode {
                switch (state.state) {
                    case "hide":
                        return html`
                            <a href="#" onClick=${show}><i class="lnir lnir-key-alt"></i> パスワードを表示 ${character()}</a>
                        `
                    case "show":
                        return html`
                            <a href="#" onClick=${hide}><i class="lnir lnir-key-alt"></i> パスワードを隠す ${character()}</a>
                            <p class="form__help">${state.password.password}</p>
                        `
                    default:
                        return assertNever(state);
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

                function character(): string {
                    switch (state.character.type) {
                        case "ascii":
                            return "";

                        case "complex":
                            return "(マルチバイト文字が含まれています)";

                        default:
                            return assertNever(state.character)
                    }
                }
            }
        }

        function loginButton(state: AuthState): VNode {
            return html`
                <div>
                    ${button()}
                    <div class="vertical vertical_small"></div>
                    ${error()}
                </div>
            `

            function button(): VNode {
                switch (state.state) {
                    case "initial":
                    case "failed-to-validation":
                    case "failed-to-login":
                        // id="login-submit" は onSubmit で button.blur() するのに使用している
                        // SubmitEvent が使用可能になったら不必要になる
                        return html`
                            <button id="login-submit" class="button button_save">ログイン</button>
                        `

                    case "try-to-login":
                    case "delayed-to-login":
                        return html`
                            <button type="button" class="button button_saving">
                                <i class="lnir lnir-spinner lnir-is-spinning"></i> ログイン中
                            </button>
                        `

                    default:
                        return assertNever(state);
                }
            }

            function error(): VNode {
                switch (state.state) {
                    case "initial":
                    case "try-to-login":
                        return html``

                    case "failed-to-validation":
                        return html`
                            <dl class="form form_error">
                                <dd class="form__field">
                                    <p class="form__message">正しく入力してください</p>
                                </dd>
                            </dl>
                        `

                    case "delayed-to-login":
                        return html`
                            <dl class="form form_warning">
                                <dd class="form__field">
                                    <p class="form__message">
                                        認証に時間がかかっています <i class="lnir lnir-spinner lnir-is-spinning"></i>
                                    </p>
                                </dd>
                            </dl>
                        `

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

                function loginErrorMessage(err: PasswordLoginError): string {
                    switch (err.type) {
                        case "unknown":
                            return "システムエラーにより認証に失敗しました";

                        case "handled":
                            switch (err.err) {
                                case "bad-request":
                                    return "アプリケーションエラーにより認証に失敗しました";

                                case "bad-response":
                                    return "レスポンスエラーにより認証に失敗しました";

                                case "invalid-password-login":
                                    return "ログインIDかパスワードが違います";

                                case "server-error":
                                    return "サーバーエラーにより認証に失敗しました";

                                default:
                                    return assertNever(err);
                            }

                        default:
                            return assertNever(err);
                    }
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

function assertNever(_: never): never {
    throw new Error("NEVER");
}
