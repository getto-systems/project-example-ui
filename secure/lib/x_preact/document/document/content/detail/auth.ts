import { VNode } from "preact"
import { html } from "htm/preact"
import { box, v_medium } from "../../box"

export function content_detail_auth(): VNode {
    return html`
        <section class="container">${renew()}</section>

        ${v_medium()}

        <section class="container">${password()}</section>
    `
}
function renew() {
    return html`
        ${box(
            "継続認証",
            html` <p>ApiRoles 登録なしで「権限なし」</p>
                <p>最大延長期間まで延長可能</p>
                <p>有効期限切れで認証エラー</p>
                <p>ログアウト済みで認証エラー</p>
                <p>チケット登録なしで認証エラー</p>
                <p>Nonce 不一致で認証エラー</p>
                <p>ユーザー不一致で認証エラー</p>`
        )}
        ${box("ログアウト", html` <p>有効期限切れで認証エラー</p>`)}
    `
}
function password() {
    return html`
        ${box(
            "パスワードログイン",
            html` <p>パスワード登録なしで認証エラー</p>
                <p>パスワード不一致で認証エラー</p>
                <p>空のパスワードで認証エラー</p>
                <p>長いパスワードで認証エラー</p>
                <p>ぎりぎりの長さで認証成功</p>`
        )}
        ${box(
            "パスワード変更",
            html` <p>変更後は古いパスワードは無効</p>

                <div class="vertical vertical_small"></div>

                <dl class="form">
                    <dt class="form__header">GetLogin</dt>
                    <dd class="form__field">
                        <p>有効期限切れで認証エラー</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">Change</dt>
                    <dd class="form__field">
                        <p>有効期限切れで認証エラー</p>
                        <p>旧パスワード不一致で変更エラー</p>
                        <p>空のパスワードで変更エラー</p>
                        <p>長いパスワードで変更エラー</p>
                        <p>ぎりぎりの長さで変更成功</p>
                    </dd>
                </dl>`
        )}
        ${box(
            "パスワードリセット",
            html` <p>変更後は古いパスワードは無効</p>
                <p>変更後はセッションは無効</p>

                <div class="vertical vertical_small"></div>

                <dl class="form">
                    <dt class="form__header">CreateSession</dt>
                    <dd class="form__field">
                        <p>不明なログインIDで生成エラー</p>
                        <p>宛先未登録で生成エラー</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">GetStatus</dt>
                    <dd class="form__field">
                        <p>不明なセッションIDで取得エラー</p>
                        <p>不明なログインIDで取得エラー</p>
                        <p>ログインID不一致で取得エラー</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">Reset</dt>
                    <dd class="form__field">
                        <p>不明なセッションIDでリセットエラー</p>
                        <p>有効期限切れでリセットエラー</p>
                        <p>有効期限ぎりぎりでリセット成功</p>
                        <p>不明なログインIDでリセットエラー</p>
                        <p>ログインID不一致でリセットエラー</p>
                        <p>不正なパスワードでリセットエラー</p>
                    </dd>
                </dl>`
        )}
    `
}
